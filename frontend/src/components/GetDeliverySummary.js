import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../css/GetDelivery.css";
import "../css/DeliverySummary.css";
import searchIcon from "../icons/search.png";
import DeliverySummaryReport from "./DeliverySummaryReport";
import DocumentTitle from "./DocumentTitle";

export default function DeliverySummary() {
  const [deliverysArray, setDeliverysArray] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  DocumentTitle("Delivery Summary");

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const response = await axios.get("http://localhost:3500/delivery/");
        const deliveries = response.data;
        console.log("deliveries", deliveries);
        const deliverysWithUserData = await Promise.all(
          deliveries.map(async (delivery) => {
            let driverName = "Unassigned";
            let custName = "Unknown";
            let custLocation = "Unknown";
            if (delivery.driverId) {
              const driverResponse = await axios.get(
                `http://localhost:3500/driver/${delivery.driverId}`
              );
              const driverData = driverResponse.data.driver;
              console.log("driverData", driverData);
              const driverUserResponse = await axios.get(
                `http://localhost:3500/user/${driverData.userId}`
              );
              const driverUserData = driverUserResponse.data.user;
              console.log("driverUserData", driverUserData);

              const customerResponse = await axios.get(
                `http://localhost:3500/user/${delivery.userId}` // Assuming userId is available in delivery data
              );
              const custData = customerResponse.data.user;

              console.log("custData", custData);

              driverName = driverUserData ? driverUserData.name : driverName;
              custName = custData ? custData.name : custName;
              custLocation = custData ? custData.address : custLocation;
            }

            return {
              ...delivery,
              custName: custName,
              custLocation: custLocation,
              driver: driverName,
            };
          })
        );
        setDeliverysArray(deliverysWithUserData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchDeliveries();
  }, []);

  // Filter deliveries based on search term and filter type
  const filteredDeliveries = deliverysArray.filter(
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
    all: deliverysArray.length,
    unassigned: deliverysArray.filter(
      (delivery) => delivery.deliveryStatus === "of-delivery"
    ).length,
    ondelivery: deliverysArray.filter(
      (delivery) => delivery.deliveryStatus === "on-delivery"
    ).length,
    completed: deliverysArray.filter(
      (delivery) => delivery.deliveryStatus === "completed"
    ).length,
  };

  const handleSortBy = (e) => {
    setSortBy(e.target.value);
  };

  const sortDelivery = (deliveries) => {
    switch (sortBy) {
      case "name":
        return deliveries.sort((a, b) => a.custName.localeCompare(b.custName));
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
        <div className="container-title-text">Deliveries Summary</div>
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
      <div className="top-buttons-bar">
      <div className="filter-buttons-deliveries-summary">
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
      <Link to="/drivers"><div className="performance-btn">Driver Performance</div></Link>
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
        <DeliverySummaryReport deliveries={sortDelivery(filteredDeliveries)} />
      </div>

      {isLoading ? (
        <div className="loading-deliveries">Beep boop boop...</div>
      ) : (
        <div className="delivery-container">
          {filteredDeliveries.length > 0 ? (
            <div>
              <div className="fields-delivery">
                <ul>
                  <li className="summary-id">Delivery ID</li>
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
                        <li className="summary-id">{delivery._id}</li>
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
