import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/GetDriver.css";
import DriverReport from "./DriverReport";

const infoIcon = require("../icons/info.png");
const searchIcon = require("../icons/search.png");

export default function GetDriver() {
    const [drivers, setDrivers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [tooltip, setTooltip] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredDrivers, setFilteredDrivers] = useState([]);

    useEffect(() => {
        const fetchDriversAndUsers = async () => {
            try {
                const driversResponse = await fetch("http://localhost:8070/driver/");
                const driversData = await driversResponse.json();
    
                const usersData = [];
                for (const driver of driversData.drivers) {
                    const userResponse = await fetch(`http://localhost:8070/user/${driver.userId}`);
                    const userData = await userResponse.json();
                    usersData.push(userData.user);
                }
    
                const combinedData = driversData.drivers.map((driver, index) => ({
                    _id: driver._id,
                    name: `${usersData[index]?.firstname} ${usersData[index]?.lastname}`,
                    contact: usersData[index]?.phonenumber,
                    deliveryCount: driver.deliveryCount,
                    averageRating: driver.averageRating > 0 ? driver.averageRating : "n/a",
                    isAvailable: driver.isAvailable
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
        // Filter drivers based on search query
        const filtered = drivers.filter(driver => {
            return (
                driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                driver._id.toLowerCase().includes(searchQuery.toLowerCase())
            );
        });
        setFilteredDrivers(filtered);
    }, [searchQuery, drivers]);

    const getAvailabilityClass = (availability) => {
        const availabilityMap = {
          true: 'Available',
          false: 'Not Available'
        };
        return availabilityMap[availability] || '';
    };

    const handleInfoHover = driverId => {
        setTooltip(`Driver ID: ${driverId}`);
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
        <div className="driver-report-actions-wrapper">
            <DriverReport drivers={filteredDrivers} />
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
                        <li className="drv-contact">{driver.contact}</li>
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
