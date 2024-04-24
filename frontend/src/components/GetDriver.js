import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/GetDriver.css";
import DriverReport from "./DriverReport";
import DocumentTitle from "./DocumentTitle";

const infoIcon = require("../icons/info.png");
const searchIcon = require("../icons/search.png");

export default function GetDriver() {
  const [drivers, setDrivers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tooltip, setTooltip] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [sortBy, setSortBy] = useState("rating");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");

  DocumentTitle("Driver Perfomance");

  useEffect(() => {
    const fetchDriversAndUsers = async () => {
      try {
        const driversResponse = await fetch("http://localhost:3500/driver/");
        const driversData = await driversResponse.json();

        const usersData = [];
        for (const driver of driversData.drivers) {
          const userResponse = await fetch(
            `http://localhost:3500/user/${driver.userId}`
          );
          const userData = await userResponse.json();
          usersData.push(userData.user);
        }

        const combinedData = driversData.drivers.map((driver, index) => ({
          _id: driver._id,
          name: `${usersData[index]?.name}`,
          contact: usersData[index]?.phonenumber,
          deliveryCount: driver.deliveryCount,
          averageRating: driver.averageRating > 0 ? driver.averageRating : "n/a",
          isAvailable: driver.isAvailable,
        }));

        setDrivers(combinedData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchDriversAndUsers();
  }, []);

  useEffect(() => {
    // Filter drivers based on search query and availability filter
    const filtered = drivers.filter((driver) => {
      const matchesSearch =
        driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver._id.toLowerCase().includes(searchQuery.toLowerCase());

      if (availabilityFilter === "all") {
        return matchesSearch;
      } else if (availabilityFilter === "available") {
        return matchesSearch && driver.isAvailable;
      } else if (availabilityFilter === "unavailable") {
        return matchesSearch && !driver.isAvailable;
      }

      return false;
    });
    setFilteredDrivers(filtered);
  }, [searchQuery, drivers, availabilityFilter]);

  const getAvailabilityClass = (availability) => {
    const availabilityMap = {
      true: "Available",
      false: "Not Available",
    };
    return availabilityMap[availability] || "";
  };

  const handleInfoHover = (driverId) => {
    setTooltip(`Driver ID: ${driverId}`);
  };

  const handleSortBy = (e) => {
    setSortBy(e.target.value);
  };

  const handleAvailabilityFilter = (filter) => {
    setAvailabilityFilter(filter);
  };

  const sortDrivers = (drivers) => {
    switch (sortBy) {
      case "name":
        return drivers.sort((a, b) => a.name.localeCompare(b.name));
      case "delCount":
        return drivers.sort((a, b) => b.deliveryCount - a.deliveryCount);
      case "rating":
        return drivers.sort((a, b) => b.averageRating - a.averageRating);
      default:
        return drivers;
    }
  };

  const countDeliveries = (availability) => {
    return drivers.filter(driver => {
      if (availability === "all") return true;
      if (availability === "available") return driver.isAvailable;
      if (availability === "unavailable") return !driver.isAvailable;
    }).length;
  };

  return (
    <div className="driver-main">
      <div className="top-bar">
        <div className="container-title-text">Driver Performance</div>
        <div className="search-container">
          <div className="search-icon">
            <img src={searchIcon} alt="search" />
          </div>
          <input
            type="text"
            placeholder="Search by name or ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="filter-buttons">
        <div
          className={`filter-btn ${
            availabilityFilter === "all" ? "active-filter" : ""
          }`}
          onClick={() => handleAvailabilityFilter("all")}
        >
          All ({countDeliveries("all")})
        </div>
        <div
          className={`filter-btn ${
            availabilityFilter === "available" ? "active-filter" : ""
          }`}
          onClick={() => handleAvailabilityFilter("available")}
        >
          Available ({countDeliveries("available")})
        </div>
        <div
          className={`filter-btn ${
            availabilityFilter === "unavailable" ? "active-filter" : ""
          }`}
          onClick={() => handleAvailabilityFilter("unavailable")}
        >
          Unavailable ({countDeliveries("unavailable")})
        </div>
      </div>
      <div className="driver-report-actions-wrapper">
        <div className="sort-menu">
          <select value={sortBy} onChange={handleSortBy}>
            <option value="name">Sort by Name</option>
            <option value="delCount">Sort by Delivery Count</option>
            <option value="rating">Sort by Rating</option>
          </select>
        </div>
        <DriverReport drivers={sortDrivers(filteredDrivers)} />
      </div>
      {isLoading ? (
        <div className="loading-drivers">Beep boop boop...</div>
      ) : (
        <div className="driver-container">
          <div className="fields">
            <ul>
              <li className="drv-name">Driver Name</li>
              <li className="drv-contact">Contact Number</li>
              <li className="drv-delivery-count">No. of Completed Deliveries</li>
              <li className="drv-rating">Rating</li>
              <li className="drv-availability">Availability</li>
            </ul>
          </div>
          <div className="driver-container">
            {filteredDrivers.length > 0 ? (
              filteredDrivers.map((driver) => (
                <div className="item" key={driver._id}>
                  <Link to={`/driver/${driver._id}`} className="item-link">
                    <ul>
                      <li className="drv-name">{driver.name}</li>
                      <li className="drv-contact">{driver.contact ? driver.contact : "n/a"}</li>
                      <li className="drv-delivery-count">{driver.deliveryCount}</li>
                      <li className="drv-rating">{driver.averageRating}</li>
                      <li className="drv-availability">
                        <div className="availability-wrapper">
                          <div className={`drv-availability-dyn ${driver.isAvailable}`}>
                            {getAvailabilityClass(driver.isAvailable)}
                          </div>
                          <div
                            className="info-icon-container"
                            onMouseEnter={() => handleInfoHover(driver._id)}
                            onMouseLeave={() => setTooltip("")}
                          >
                            <img src={infoIcon} alt="info" className="info-icon" />
                            <span className="drv-tooltiptext">{tooltip}</span>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </Link>
                </div>
              ))
            ) : (
              <div>No drivers found.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
