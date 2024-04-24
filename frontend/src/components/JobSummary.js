import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../css/GetDelivery.css";
import "../css/JobSummary.css";
import searchIcon from "../icons/search.png";
import JobSummaryReport from "./JobSummaryReport";
import DocumentTitle from "./DocumentTitle";

export default function JobSummary() {
  const [jobsArray, setJobsArray] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  DocumentTitle("Job Summary");

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const response = await axios.get("http://localhost:3500/delivery/");
        const deliveries = response.data;
        const jobsWithUserData = await Promise.all(
          deliveries.map(async (delivery) => {
            // Fetch driver data for each delivery if driverId is not null
            let driverName = "Unassigned";
            let custName = "Unknown";
            let custLocation = "Unknown";
            if (delivery.driverId) {
              const driverResponse = await axios.get(
                `http://localhost:3500/driver/${delivery.driverId}`
              );
              const driverData = driverResponse.data.driver;
              const driverUserResponse = await axios.get(
                `http://localhost:3500/user/${driverData.userId}`
              );
              const tempuserId = "6623f8eb4e06c62c5ff68977";
              const userResponse = await axios.get(
                `http://localhost:3500/user/${tempuserId}`
              );
              const driverUserData = driverUserResponse.data.user;
              const userData = userResponse.data.user;
              //   driverName = userData ? `${userData.firstname} ${userData.lastname}` : driverName;
              driverName = driverUserData ? `${userData.name}` : driverName;
              custName = userData ? `${userData.name}` : custName;
              custLocation = userData ? `${userData.address}` : custLocation;
            }

            return {
              ...delivery,
              custName: custName,
              custLocation: custLocation,
              driver: driverName,
            };
          })
        );
        setJobsArray(jobsWithUserData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchDeliveries();
  }, []);

  // Filter deliveries based on search term and filter type
  const filteredDeliveries = jobsArray.filter(
    (delivery) =>
      (delivery.deliveryStatus === filterType || filterType === "all") &&
      (delivery.custName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.custLocation
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        delivery.driver?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery._id?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Count the number of deliveries for each filter type
  const deliveryCount = {
    all: jobsArray.length,
    unassigned: jobsArray.filter(
      (delivery) => delivery.deliveryStatus === "of-delivery"
    ).length,
    ondelivery: jobsArray.filter(
      (delivery) => delivery.deliveryStatus === "on-delivery"
    ).length,
    completed: jobsArray.filter(
      (delivery) => delivery.deliveryStatus === "completed"
    ).length,
  };

  const handleSortBy = (e) => {
    setSortBy(e.target.value);
  };

  const sortDelivery = (deliveries) => {
    switch (sortBy) {
      case "name":
        return deliveries.sort((a, b) => a.cusName.localeCompare(b.cusName));
      case "date":
        return deliveries.sort((a, b) => new Date(a.date) - new Date(b.date));
      case "location":
        return deliveries.sort((a, b) =>
          a.cusLocation.localeCompare(b.cusLocation)
        );
      case "payment":
        return deliveries.sort((a, b) => a.payment.localeCompare(b.payment));
      case "rating":
        return deliveries.sort((a, b) => b.rating - a.rating); // Sorting in descending order
      default:
        return deliveries;
    }
  };

  return (
    <div className="delivery-container-main">
      <div className="top-bar">
        <div className="container-title-text">Job Summary</div>
        <div className="search-container">
          <div className="search-icon">
            <img src={searchIcon} alt="search" />
          </div>
          <input
            type="text"
            placeholder="Search by customer, driver, or delivery ID"
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
          All ({deliveryCount.all})
        </div>
        <div
          className={`filter-btn ${
            filterType === "unassigned" ? "active-filter" : ""
          }`}
          onClick={() => setFilterType("of-delivery")}
        >
          Unassigned ({deliveryCount.unassigned})
        </div>
        <div
          className={`filter-btn ${
            filterType === "ondelivery" ? "active-filter" : ""
          }`}
          onClick={() => setFilterType("on-delivery")}
        >
          Accepted ({deliveryCount.ondelivery})
        </div>
        <div
          className={`filter-btn ${
            filterType === "completed" ? "active-filter" : ""
          }`}
          onClick={() => setFilterType("completed")}
        >
          Completed ({deliveryCount.completed})
        </div>
      </div>

      <div className="driver-info-report-actions-wrapper">
        <div className="sort-menu">
          <select value={sortBy} onChange={handleSortBy}>
            <option value="name">Sort by Name</option>
            <option value="date">Sort by Date</option>
            <option value="location">Sort by Location</option>
            <option value="payment">Sort by Payment Method</option>
            <option value="driver">Sort by Driver</option>
          </select>
        </div>
        <JobSummaryReport deliveries={sortDelivery(filteredDeliveries)} />
      </div>

      {isLoading ? (
        <div className="loading-deliveries">Beep boop boop...</div>
      ) : (
        <div className="job-container">
          {filteredDeliveries.length > 0 ? (
            <div>
              <div className="fields-job">
                <ul>
                  <li className="summary-name">Customer Name</li>
                  <li className="summary-date">Date</li>
                  <li className="summary-location">Location</li>
                  <li className="summary-payment">Payment</li>
                  <li className="summary-driver">Driver</li>
                </ul>
              </div>
              <div className="delivery-container">
                {filteredDeliveries.map((delivery) => (
                  <div className="item-delivery" key={delivery._id}>
                    <div className="item-link">
                      <ul>
                        <li className="summary-name">{delivery.custName}</li>
                        <li className="summary-date">
                          {new Date(delivery.date).toLocaleDateString()}
                        </li>
                        <li className="summary-location">
                          {delivery.custLocation}
                        </li>
                        <li className="summary-payment">
                          {delivery.paymentMethod}
                        </li>
                        <li className="summary-driver">
                          {delivery.driverId ? (
                            <Link to={`/driver/${delivery.driverId}`}>
                              {delivery.driver}
                            </Link>
                          ) : (
                            delivery.driver
                          )}
                        </li>
                      </ul>
                    </div>
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
