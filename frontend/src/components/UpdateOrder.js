import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../css/UpdateOrder.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function UpdateOrder() {
  const { id } = useParams();
  const [supplier_name, setName] = useState("");
  const [catogory, setCat] = useState("");
  const [email, setEmail] = useState("");
  const [order_list, setOrder] = useState(null);
  const [ship_date, setDate] = useState("");
  const [delived_date, setDDate] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(`http://localhost:3500/shipment/displays/${id}`);
      const shipment = response.data.shipment;

      setName(shipment.supplier_name);
      setCat(shipment.catogory);
      setEmail(shipment.email);
      const file = new File([shipment.order_list], shipment.order_list);
      setOrder(file);
      const formattedDate = new Date(shipment.ship_date).toISOString().split('T')[0];
      setDate(formattedDate);
      const formattedDDate = shipment.delived_date ? new Date(shipment.delived_date).toISOString().split('T')[0] : "";
      setDDate(formattedDDate);
      setStatus(shipment.status);
    }
    fetchData();
  }, [id]);

  const updateShipment = async (e) => {
    e.preventDefault();

    const updatedShipment = {
      supplier_name,
      catogory,
      email,
      ship_date,
      delived_date,
      status
    };

    const formData = new FormData();
    
    for (const key in updatedShipment) {
      formData.append(key, updatedShipment[key]);
    }

    if (order_list) {
      formData.append("file", order_list);
    }

    // Make axios PUT request with FormData
    await axios.put(`http://localhost:3500/shipment/updates/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
    .then((res) => {
      toast.success("Order Updated Successfully");
      navigate("/displays");
    })
    .catch((err) => {
      console.error(err);
      toast.error("Order Can Not Update");
    });
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
              readOnly
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
            <input accept="application/pdf"
              type="file"
              className="SR_input"
              onChange={(e) => {
                setOrder(e.target.files[0]); // Set the order_list state with the selected file
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

          <div className="SR_input-box">
            <label htmlFor="date">Delivered Date</label>
            <input
              type="date"
              className="SR_input"
              value={delived_date}
              onChange={(e) => {
                setDDate(e.target.value);
              }}
              disabled={status !== "Received"}
            ></input>
          </div>

          <div className="SR_input-box">
            <label htmlFor="status">Status</label>
            <div className="SR_selecter" required>
              <select
                className="SR_input"
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                }}
              >
                <option value="">Select Status</option>
                <option value="Pending">Pending</option>
                <option value="Accepted">Accepted</option>
                <option value="Declined">Declined</option>
                <option value="Received">Received</option>
                <option value="Sending">Sending</option>
              </select>
            </div>
          </div>

          <div className="SR_button">
            <button type="submit" className="SR_btn"> Update </button>
          </div>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}

export default UpdateOrder;
