import React, { useState, useEffect } from "react";
import axios from "axios";
import { Checkbox } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import "../css/kitchenPanel.css";

export default function KitchenPanel(){
  const [orders, setOrders] = useState([]);
  const [baseTypeFilter, setBaseTypeFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const getAllOrders = async () => {
    try {
      const { data } = await axios.get("http://localhost:4001/api/orders", {
        params: {
          base_type: baseTypeFilter,
        },
      });
      setOrders(data.orders);
    } catch (error) {
      console.log(error);
    }
  };

  const searchOrders = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:4001/api/orders/search",
        {
          params: {
            base_name: searchQuery,
          },
        }
      );
      setOrders(data.orders);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (baseTypeFilter !== null) {
      getAllOrders();
    }
  }, [baseTypeFilter]);

  useEffect(() => {
    if (searchQuery !== "") {
      searchOrders();
    }
  }, [searchQuery]);

  const handleBaseTypeFilter = (baseType) => {
    setBaseTypeFilter(baseType);
    setSearchQuery("");
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = async (index) => {
    console.log("Submit clicked for order", index);
    try {
      const updatedOrder = { ...orders[index], status: "completed" };
      const response = await axios.put(`http://localhost:4001/api/orders/${updatedOrder._id}`, updatedOrder);
      const updatedOrders = [...orders];
      updatedOrders[index] = response.data;
      setOrders(updatedOrders);
      console.log("Order status updated:", response.data);
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  return (
    <div className="container-fluid row mt-3 home-page">
      <div className="col-md-3 filters">
        <h4 className="text-center">Filter By Kitchen</h4>
        <div className="d-flex flex-column">
          <Checkbox.Group
            options={[
              { label: "Rice", value: "Rice" },
              { label: "Others", value: "Others" },
              { label: "Beverages", value: "Beverages" },
              { label: "Bakery", value: "Bakery" },
            ]}
            value={baseTypeFilter}
            onChange={(values) => handleBaseTypeFilter(values[0])}
          />
        </div>
      </div>

      <div className="col-md-9">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by base name"
            value={searchQuery}
            onChange={handleSearch}
          />
          <SearchOutlined className="search-icon" />
        </div>

        <h1 className="orders-heading">All Orders</h1>

        <div
          className="orders-container"
          style={{ maxHeight: "550px", overflowY: "auto" }}
        >
          {orders.map((order, index) => (
            <div className="order-card" key={index}>
              <p>
                <strong>Base Name:</strong> {order.base_name}
              </p>
              <p>
                <strong>Portion Name:</strong>
              </p>
              <ul>
                {order.portion_name.map((portion, i) => (
                  <li key={i}>{portion}</li>
                ))}
              </ul>
              <p>
                <strong>Quantity:</strong> {order.qty}
              </p>
             
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
