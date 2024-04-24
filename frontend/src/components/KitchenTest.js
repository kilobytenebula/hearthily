import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/KitchenTest.css";
import DocumentTitle from "./DocumentTitle";

export default function KitchenTest() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState("");
  const [selectedUser, setSelectedUser] = useState("");

  DocumentTitle("Kitchen Test");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:3500/order/");
        // Filter preparing orders and pending orders
        const preparingOrders = response.data.filter(
          (orderItem) => orderItem.status === "preparing"
        );
        const pendingOrders = response.data.filter(
          (orderItem) => orderItem.status === "pending"
        );
        // Label preparing orders with [Preparing]
        const formattedPreparingOrders = preparingOrders.map((order) => ({
          ...order,
          base_name: `[Preparing] ${order.base_name}`,
        }));
        // Set orders state with both preparing and pending orders
        setOrders([...formattedPreparingOrders, ...pendingOrders]);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
      }
    };

    // Fetch users
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3500/user/");
        const avbUsers = response.data.filter(
          (user) => user.role === "user"
        ); 
        setUsers(avbUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchOrders();
    fetchUsers();
  }, []);

  const prepareOrder = async () => {
    if (!selectedOrder) {
      alert("Please select an order.");
      return;
    }
    try {
      await axios.put(`http://localhost:3500/order/update/${selectedOrder}`, {
        status: "preparing",
      });
      alert("Order prepared!");
    } catch (error) {
      console.error("Error preparing order:", error);
    }
  };

  const markForDelivery = async () => {
    if (!selectedOrder || !selectedUser) {
      alert("Please select an order and a user.");
      return;
    }
    try {
      const paymentResponse = await axios.get(`http://localhost:3500/payment/get/${selectedOrder}`);
      const paymentMethod = paymentResponse.data[0].paymentMethod;
      console.log(paymentMethod);
      await axios.post("http://localhost:3500/delivery/add", {
        userId: selectedUser,
        orderId: selectedOrder,
        paymentMethod: paymentMethod,
        deliveryStatus: "of-delivery"
      });
      await axios.put(`http://localhost:3500/order/update/${selectedOrder}`, {
        status: "of-delivery",
      });
      alert("Order marked for delivery!");
    } catch (error) {
      console.error("Error marking order for delivery:", error);
    }
  };

  return (
    <div className="kitchen-test">
      <div className="top-bar">
        <div className="container-title-text">
          Decentralized Network of Micro-Kitchens
        </div>
        <div className="search-container"></div>
      </div>
      <div className="parent-container">
      <div className="dropdowns-container">
        <div className="dropdown-container">
          <label htmlFor="orderSelect">Select Order:</label>
          <select
            id="orderSelect"
            value={selectedOrder}
            onChange={(e) => setSelectedOrder(e.target.value)}
          >
            <option value="">-- Select an order --</option>
            {orders.map((order) => (
              <option key={order._id} value={order._id}>
                {order.base_name} with {order.portion_name.join(", ")}
              </option>
            ))}
          </select>
        </div>
        <div className="dropdown-container">
          {selectedOrder &&
            orders.find(
              (order) =>
                order._id === selectedOrder && order.status === "preparing"
            ) && (
              <>
                <label htmlFor="userSelect">Select User:</label>
                <select
                  id="userSelect"
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                >
                  <option value="">-- Select a user --</option>
                  {users.map((user) => (
                    <option
                      key={user._id}
                      value={user._id}
                    >{`${user.name}`}</option>
                  ))}
                </select>
              </>
            )}
        </div>
        <div className="actions-container">
          {selectedOrder &&
            orders.find(
              (order) =>
                order._id === selectedOrder && order.status === "pending"
            ) && <div className="kitchen-action-btns" onClick={prepareOrder}>Prepare this Order</div>}
          {selectedOrder &&
            orders.find(
              (order) =>
                order._id === selectedOrder && order.status === "preparing"
            ) && <div className="kitchen-action-btns" onClick={markForDelivery}>Mark for Delivery</div>}
        </div>
    </div>
      </div>
      </div>
  );
}
