import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/kitchenPanel.css";
import DocumentTitle from "./DocumentTitle";
import searchIcon from "../icons/search.png";

export default function KitchenPanel() {
  const [orders, setOrders] = useState([]);
  const [baseTypeFilter, setBaseTypeFilter] = useState("Rice");
  const [searchQuery, setSearchQuery] = useState("");

  DocumentTitle("Kitchen Management");

  useEffect(() => {
    getAllOrders();
  }, [baseTypeFilter, searchQuery]); // Update orders whenever baseTypeFilter or searchQuery changes

  const getAllOrders = async () => {
    try {
      const { data } = await axios.get("http://localhost:3500/kitchenOrder/orders", {
        params: {
          base_type: baseTypeFilter,
        },
      });
      // Filter orders based on both base type and search query
      const filteredOrders = data.orders.filter(order =>
        order.base_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setOrders(filteredOrders);
    } catch (error) {
      console.log(error);
    }
  };

  const startPreparation = async (orderId, index) => {
    try {
      const response = await axios.put(`http://localhost:3500/order/update/${orderId}`, { status: "preparing" });
      getAllOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const markForDelivery = async (orderId, customerId) => {
    try {
      const response = await axios.put(`http://localhost:3500/order/update/${orderId}`, { status: "of-delivery" });
      const paymentResponse = await axios.get(`http://localhost:3500/payment/get/${orderId}`);
      const paymentMethod = paymentResponse.data[0].paymentMethod;
      console.log(paymentMethod);
      await axios.post("http://localhost:3500/delivery/add", {
        userId: customerId,
        orderId: orderId,
        paymentMethod: paymentMethod,
        deliveryStatus: "of-delivery"
      });
      alert("Order marked for delivery!");
      getAllOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleBaseTypeFilter = (baseType) => {
    setBaseTypeFilter(baseType);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    // Trigger search whenever the user types in a base name
    getAllOrders();
  };

  return (
    <div className="kitchen-list-main">
      <div className="top-bar">
        <div className="container-title-text">Kitchen Management</div>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by base type"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
           <div className="search-icon">
            <img src={searchIcon} alt="search" />
          </div>
        </div>
      </div>
      <div className="filter-buttons">
        {/* Filter buttons */}
        <div
          className={`filter-btn ${baseTypeFilter === "Rice" ? "active-filter" : ""}`}
          onClick={() => handleBaseTypeFilter("Rice")}
        >
          Rice
        </div>
        <div
          className={`filter-btn ${baseTypeFilter === "Others" ? "active-filter" : ""}`}
          onClick={() => handleBaseTypeFilter("Others")}
        >
          Others
        </div>
        <div
          className={`filter-btn ${baseTypeFilter === "Beverages" ? "active-filter" : ""}`}
          onClick={() => handleBaseTypeFilter("Beverages")}
        >
          Beverages
        </div>
        <div
          className={`filter-btn ${baseTypeFilter === "Bakery" ? "active-filter" : ""}`}
          onClick={() => handleBaseTypeFilter("Bakery")}
        >
          Bakery
        </div>
      </div>

      <div className="col-md-9">
        <div className="orders-container">
          {orders.map((order, index) => (
            <div className="order-card" key={index}>
            <div className="order-card-content">
              <p>
                <strong>Base Name:</strong> {order.base_name}
              </p>
              <div className="portions-container">
              <p>
                <strong>{order.portion_name.length === 0 ? '' : (order.portion_name.length > 1 ? 'Portions: ' : 'Portion: ')}</strong>
              </p>
              <ul>
                {order.portion_name.map((portion, i) => (
                  <li key={i}>{portion}</li>
                ))}
              </ul>
              </div>
              <p>
                <strong>Quantity:</strong> {order.qty}
              </p>
              {/* Additional order information */}
            </div>
            <div className="ktn-btns-container">
              {order.status === 'pending' && (
                <div className="ktn-btn" onClick={() => startPreparation(order._id, index)}>Start Preparation</div>
              )}
              {order.status === 'preparing' && (
                <div className="ktn-btn" onClick={() => markForDelivery(order._id, order.customerId)}>Mark for Delivery</div>
              )}
            </div>
          </div>
          ))}
        </div>
      </div>
    </div>
  );
}
