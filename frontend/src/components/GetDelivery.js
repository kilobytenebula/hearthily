import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../css/GetDelivery.css';
import DocumentTitle from "./DocumentTitle";

export default function GetDelivery() {
  const [deliveryArray, setDeliveryArray] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [displayData, setDisplayData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  DocumentTitle("Available Jobs");

  useEffect(() => {
    // Fetch delivery data
    axios.get('http://localhost:3500/delivery/')
      .then(response => {
        const deliveryData = response.data.filter(delivery => delivery.deliveryStatus === 'of-delivery'); 
        setDeliveryArray(deliveryData);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false)
      });
  }, []);

  useEffect(() => {
    const fetchOrdersAndUsers = async () => {
      const orders = [];
      const users = [];
      const displayData = [];

      for (const deliveryItem of deliveryArray) {
        try {
          // Fetch order data
          const orderResponse = await axios.get(`http://localhost:3500/order/${deliveryItem.orderId}`);
          const orderData = orderResponse.data.order;
          orders.push(orderData);

          // Fetch user data
          const userResponse = await axios.get(`http://localhost:3500/user/${deliveryItem.userId}`);
          const userData = userResponse.data.user;
          users.push(userData);
        } catch (error) {
          console.log(error);
        }

        const correspondingUser = users.find(user => user._id === deliveryItem.userId);

        const deliveryId = deliveryItem._id;
        const name = `${correspondingUser?.name}`;
        const date = deliveryItem.date ? new Date(deliveryItem.date).toLocaleDateString() : '';
        const location = correspondingUser?.address || '';
        const payment = deliveryItem.paymentMethod;

        displayData.push({
          deliveryId,
          name,
          date,
          location,
          payment
        });
      }
      setDisplayData(displayData);
    };

    if (deliveryArray.length > 0) {
      fetchOrdersAndUsers();
    }

  }, [deliveryArray]);

  // Filter deliveries based on search term and filter type
  const filteredDeliveries = displayData.filter(
    (delivery) =>
      (delivery.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.payment.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterType === "all" || delivery.payment.toLowerCase() === filterType)
  );

  // Sort filtered deliveries based on sort by type
  const sortDeliveries = (deliveries) => {
    switch (sortBy) {
      case "name":
        return deliveries.sort((a, b) => a.name.localeCompare(b.name));
      case "date":
        return deliveries.sort((a, b) => new Date(b.date) - new Date(a.date));
      case "location":
        return deliveries.sort((a, b) => a.location.localeCompare(b.location));
      case "payment":
        return deliveries.sort((a, b) => a.payment.localeCompare(b.payment));
      default:
        return deliveries;
    }
  };

  return (
    <div className="delivery-container-main">
      <div className="top-bar">
        <div className="container-title-text">Available Jobs</div>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by customer name, location, or payment"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="filter-buttons">
        <div
          className={`filter-btn ${filterType === "all" ? "active-filter" : ""}`}
          onClick={() => setFilterType("all")}
        >
          All ({filteredDeliveries.length})
        </div>
        <div
          className={`filter-btn ${filterType === "cod" ? "active-filter" : ""}`}
          onClick={() => setFilterType("cod")}
        >
          COD ({filteredDeliveries.filter(delivery => delivery.payment === "COD").length})
        </div>
        <div
          className={`filter-btn ${filterType === "paid" ? "active-filter" : ""}`}
          onClick={() => setFilterType("paid")}
        >
          Paid ({filteredDeliveries.filter(delivery => delivery.payment === "Paid").length})
        </div>
      </div>
      <div className="jobhistory-report-actions-wrapper">
        <div className="sort-menu">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="name">Sort by Customer Name</option>
            <option value="date">Sort by Date</option>
            <option value="location">Sort by Location</option>
            <option value="payment">Sort by Payment Method</option>
          </select>
        </div>
      </div>
      {isLoading ? (
        <div className='loading-deliveries'>Beep boop boop...</div>
      ) : (
        sortDeliveries(filteredDeliveries).length > 0 ? (
          <div>
            <div className="fields">
              <ul>
                <li className='name'>Customer Name</li>
                <li className='date'>Date</li>
                <li className='price'>Location</li>
                <li className='payment'>Payment</li>
              </ul>
            </div>
            <div className="delivery-container">
              {sortDeliveries(filteredDeliveries).map((item) => (
                <div className="item-delivery" key={item.deliveryId}>
                  <Link to={`/delivery/job/${item.deliveryId}`} className="item-link">
                    <ul>
                      <li className="name">{item.name}</li>
                      <li className="date">{item.date}</li>
                      <li className="price">{item.location}</li>
                      <li className="payment">{item.payment}</li>
                    </ul>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="not-available">No available deliveries. Check back soon!</div>
        )
      )}
    </div>
  );
}
