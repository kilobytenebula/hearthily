import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../css/GetDelivery.css";
import searchIcon from "../icons/search.png";
import JobHistoryReport from "./JobHistoryReport";
import DocumentTitle from "./DocumentTitle";
import { useAuth } from "../Services/Auth/AuthContext";

export default function GetJobHistory() {
  const [jobsArray, setJobsArray] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const { userId } = useAuth();

  DocumentTitle("Job History");


  useEffect(() => {
    // Fetch delivery data
    axios
      .get("http://localhost:3500/delivery/")
      .then((response) => {
        const jobs = response.data.filter(
          (delivery) =>
            (delivery.deliveryStatus === "on-delivery" ||
              delivery.deliveryStatus === "completed") &&
            delivery.driverId === userId
        );
        // Fetch user data for each job
        Promise.all(
          jobs.map((job) =>
            axios.get(`http://localhost:3500/user/${job.userId}`)
          )
        )
          .then((userResponses) => {
            const jobsWithUserData = jobs.map((job, index) => {
              const userData = userResponses[index].data.user;
              return {
                ...job,
                name: `${userData.name}`,
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

  // Filter deliveries based on search term, filter type, and sort order
  const filteredDeliveries = jobsArray
    .filter(
      (delivery) =>
        (delivery.deliveryStatus === filterType || filterType === "all") &&
        (delivery.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          delivery.deliveryId?.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "date":
          return new Date(b.date) - new Date(a.date);
        case "location":
          return a.location.localeCompare(b.location);
        case "payment":
          return a.paymentMethod.localeCompare(b.paymentMethod);
        default:
          return 0;
      }
    });

  // Function to handle sorting by different criteria
  const handleSortBy = (e) => {
    setSortBy(e.target.value);
  };

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
          All ({jobsArray.length})
        </div>
        <div
          className={`filter-btn ${
            filterType === "on-delivery" ? "active-filter" : ""
          }`}
          onClick={() => setFilterType("on-delivery")}
        >
          Accepted ({jobsArray.filter(job => job.deliveryStatus === "on-delivery").length})
        </div>
        <div
          className={`filter-btn ${
            filterType === "completed" ? "active-filter" : ""
          }`}
          onClick={() => setFilterType("completed")}
        >
          Completed ({jobsArray.filter(job => job.deliveryStatus === "completed").length})
        </div>
      </div>
      <div className="jobhistory-report-actions-wrapper">
        <div className="sort-menu">
          <select value={sortBy} onChange={handleSortBy}>
            <option value="name">Sort by Customer Name</option>
            <option value="date">Sort by Date</option>
            <option value="location">Sort by Location</option>
            <option value="payment">Sort by Payment Method</option>
          </select>
        </div>
        <JobHistoryReport deliveries={filteredDeliveries} />
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