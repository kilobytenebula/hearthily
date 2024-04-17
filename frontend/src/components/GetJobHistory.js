import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../css/GetDelivery.css";
import searchIcon from "../icons/search.png";

export default function GetJobHistory() {
  const [jobsArray, setJobsArray] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const driverId = "661bfcaff9b3692a8a15a7f2";

  useEffect(() => {
    // Fetch delivery data
    axios
      .get("http://localhost:8070/delivery/")
      .then((response) => {
        const jobs = response.data.filter(
          (delivery) =>
            (delivery.deliveryStatus === "on-delivery" ||
              delivery.deliveryStatus === "completed") &&
            delivery.driverId === driverId
        );
        // Fetch user data for each job
        Promise.all(
          jobs.map((job) =>
            axios.get(`http://localhost:8070/user/${job.userId}`)
          )
        )
          .then((userResponses) => {
            const jobsWithUserData = jobs.map((job, index) => {
              const userData = userResponses[index].data.user;
              return {
                ...job,
                name: `${userData.firstname} ${userData.lastname}`,
                location: userData.address,
              };
            });
            setJobsArray(jobsWithUserData);
            setIsLoading(false);
          })
          .catch((error) => {
            console.log("User data fetch error:", error);
            setIsLoading(false);
          });
      })
      .catch((error) => {
        console.log("Fetch error:", error);
        setIsLoading(false);
      });
  }, []);

  // Filter deliveries based on search term and filter type
  const filteredDeliveries = jobsArray.filter(
    (delivery) =>
      (delivery.deliveryStatus === filterType || filterType === "all") &&
      (delivery.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.deliveryId?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="delivery-container-main">
      <div className="top-bar">
        <div className="container-title-text">Job History</div>
        <div className="search-container">
          <div className="search-icon">
            <img src={searchIcon} alt="search" />
          </div>
          <input
            type="text"
            placeholder="Search by name or ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="filter-buttons">
        <div
          className={`filter-btn ${
            filterType === "all" ? "active-filter" : ""
          }`}
          onClick={() => setFilterType("all")}
        >
          All
        </div>
        <div
          className={`filter-btn ${
            filterType === "on-delivery" ? "active-filter" : ""
          }`}
          onClick={() => setFilterType("on-delivery")}
        >
          Accepted
        </div>
        <div
          className={`filter-btn ${
            filterType === "completed" ? "active-filter" : ""
          }`}
          onClick={() => setFilterType("completed")}
        >
          Completed
        </div>
      </div>

      {isLoading ? (
        <div className="loading-deliveries">Beep boop boop...</div>
      ) : (
        <div className="job-container">
          {filteredDeliveries.length > 0 ? (
            <div>
              <div className="fields-job">
                <ul>
                  <li className="name">Customer Name</li>
                  <li className="date">Date</li>
                  <li className="location">Location</li>
                  <li className="payment">Payment</li>
                </ul>
              </div>
              <div className="delivery-container">
                {filteredDeliveries.map((delivery) => (
                  <div className="item-delivery" key={delivery._id}>
                    <Link
                      to={`/delivery/job/${delivery._id}`}
                      className="item-link"
                    >
                      <ul>
                        <li className="name">{delivery.name}</li>
                        <li className="date">
                          {new Date(delivery.date).toLocaleDateString()}
                        </li>
                        <li className="location">{delivery.location}</li>
                        <li className="payment">{delivery.paymentMethod}</li>
                      </ul>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="not-available">No deliveries found.</div>
          )}
        </div>
      )}
    </div>
  );
}
