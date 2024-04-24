import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../css/UpdateOrder.css";

function UpdateOrder() {
    const { id } = useParams()
    const [supplier_name, setName] = useState("");
    const [catogory, setCat] = useState("");
    const [email, setEmail] = useState("");
    const [order_list, setOrder] = useState(null);
    const [ship_date, setDate] = useState("");

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(`http://localhost:3500/shipment/displays/${id}`);
      const shipment = response.data.shipment;

      setName(shipment.supplier_name);
      setCat(shipment.catogory);
      setEmail(shipment.email);
      const formattedDate = new Date(shipment.ship_date).toISOString().split('T')[0];
      setDate(formattedDate);
    }
    fetchData();
  }, [id]);

  const updateShipment = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", order_list);
    formData.append("supplier_name", supplier_name);
    formData.append("catogory", catogory);
    formData.append("email", email);
    formData.append("ship_date", ship_date);

    try {
      await axios.put(`http://localhost:3500/shipment/updates/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      alert("Order Updated Successfully");
      window.location.href = "/displays"; // Navigate to the second page
    } catch (error) {
      console.error(error);
      alert("Order Can Not Update");
    }
  };


  return (
    <div className="SR_container">
      <form onSubmit={updateShipment}>
        <h2 className="SR_SupName">Update Order</h2>
        <div className="SR_content">
          <div className="SR_input-box">
            <label htmlFor="name">Supplier Name</label>
            <input
              type="text"
              className="SR_input"
              required
              value={supplier_name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            ></input>
          </div>

          <div className="SR_input-box">
            <label htmlFor="catogory">Category</label>
            <div className="SR_selecter" required>
              <select
                value={catogory}
                onChange={(e) => {
                  setCat(e.target.value);
                }}
              >
                <option value="">Select</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Fruits">Fruits</option>
                <option value="Meats">Meats</option>
                <option value="Sea Foods">Sea Foods</option>
                <option value="Spices">Spices</option>
                <option value="Kitchen Equipment">Kitchen Equipment</option>
                <option value="Packing">Packing</option>
              </select>
            </div>
          </div>

          <div className="SR_input-box">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              className="SR_input"
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              title="Please enter a valid email address"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            ></input>
          </div>

          <div className="SR_input-box">
            <label htmlFor="order">Order List</label>
            <input
              type="file"
              className="SR_input"
              required
              value={order_list}
              onChange={(e) => {
                setOrder(e.target.files[0]);
              }}
            ></input>
          </div>

          <div className="SR_input-box">
            <label htmlFor="date">Order Date</label>
            <input
              type="date"
              className="SR_input"
              required
              value={ship_date}
              onChange={(e) => {
                setDate(e.target.value);
              }}
            ></input>
          </div>

          <div className="SR_button">
            <button type="submit" className="SR_btn"> Update </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default UpdateOrder;