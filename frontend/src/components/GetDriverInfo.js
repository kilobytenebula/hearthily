import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../css/GetDriverInfo.css";
import searchIcon from "../icons/search.png";
import badge from "../icons/badge.png";

export default function GetDriverInfo() {
  const [driver, setDriver] = useState(null);
  const [delivery, setDelivery] = useState([]);
  const [loading, setLoading] = useState(true);
  const { driverId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDelivery, setFilteredDelivery] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const driverResponse = await fetch(
          `http://localhost:8070/driver/${driverId}`
        );
        const driverData = await driverResponse.json();
        const userData = await fetchUserData(driverData.driver.userId);
        const combinedData = {
          _id: driverData.driver._id,
          name: `${userData.firstname} ${userData.lastname}`,
          contact: userData.phonenumber,
          deliveryCount: driverData.driver.deliveryCount,
          averageRating:
            driverData.driver.avgRating > 0
              ? driverData.driver.avgRating
              : "n/a",
          isAvailable: driverData.driver.isAvailable,
        };
        setDriver(combinedData);

        const deliveryResponse = await fetch(
          `http://localhost:8070/delivery/driver/${driverId}`
        );
        const deliveryData = await deliveryResponse.json();
        const deliveries = deliveryData.driverData.map((deliveryItem) => ({
          _id: deliveryItem.delivery._id,
          cusName: deliveryItem.delivery.cusName,
          cusLocation: deliveryItem.delivery.cusLocation,
          rating: deliveryItem.delivery.rating,
          date: deliveryItem.delivery.date.split("T")[0],
          payment: deliveryItem.delivery.paymentMethod,
          status: deliveryItem.delivery.deliveryStatus,
        }));
        setDelivery(deliveries);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    }

    fetchData();
  }, [driverId]);

  useEffect(() => {
    // Filter deliveries based on search query
    const filtered = delivery.filter((item) =>
      item.cusName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredDelivery(filtered);
  }, [delivery, searchQuery]);

  const fetchUserData = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8070/user/${userId}`);
      const userData = await response.json();
      return userData.user;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return {};
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="driver-info-main">
      <div className="top-bar">
        <div className="container-title-text">Driver Details</div>
        <div className="search-container">
          <div className="search-icon">
            <img src={searchIcon} alt="search" />
          </div>
          <input
            type="text"
            placeholder="Search by name or ID"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>
      <div className="driver-info-wrapper">
        {loading ? (
          <div className="loading-drivers">Beep boop boop...</div>
        ) : (
          <>
            {driver && (
              <div className="driver-info-container">
                <div className="driver-info-pane">
                  <div className="driver-info-row">
                    <div>Driver Name:</div>
                    <div>{driver.name}</div>
                  </div>
                  <div className="driver-info-row">
                    <div>Contact Number:</div>
                    <div>{driver.contact}</div>
                  </div>
                  <div className="driver-info-row">
                    <div>Total Jobs:</div> <div>{driver.deliveryCount}</div>
                  </div>
                </div>
                <div className="driver-availability-container">
                  <div className="driver-availability">
                    {driver.isAvailable
                      ? "Driver is available"
                      : "Driver is not available"}
                  </div>
                  <div className="driver-availability-additional">
                    {driver.isAvailable ? (
                      <div className="driver-last-completed-order">
                        Last Delivery Date: {driver._id}
                      </div>
                    ) : (
                      <div className="driver-currently-assigned-order">
                        Current Delivery ID: {driver._id}
                      </div>
                    )}
                  </div>
                </div>
                <div className="driver-rating-container">
                  <div className="driver-rating-wrapper">
                    <div className="driver-rating">{driver.averageRating}</div>
                    <div className="driver-class">
                      {driver.averageRating > 4.5 && (
                        <div className="top-rated">
                          <img src={badge} alt="badge" title={`${driver.name}\nis a Top Rated Driver`} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="driver-info-completed-deliveries-container">
              <div className="completed-deliveries-title">Job History</div>
              {filteredDelivery.length === 0 ? (
                <div className="no-completed-jobs">No completed jobs</div>
              ) : (
                <div className="completed-deliveries-wrapper">
                  <div className="fields-job">
                    <ul>
                      <li className="driver-info-cusname">Customer Name</li>
                      <li className="driver-info-date">Date</li>
                      <li className="driver-info-location">Location</li>
                      <li className="driver-info-payment">Payment Method</li>
                      <li className="driver-info-rating">Rating</li>
                    </ul>
                  </div>
                  <div className="delivery-container">
                    {filteredDelivery.map((delivery) => (
                      <div className="item-delivery" key={delivery._id}>
                        <div className="driver-info-cusname">
                          {delivery.cusName}
                        </div>
                        <div className="driver-info-date">{delivery.date}</div>
                        <div className="driver-info-location">
                          {delivery.cusLocation}
                        </div>
                        <div className="payment">{delivery.payment}</div>
                        <div className="driver-info-rating">
                          {delivery.rating}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
