import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/ShipmentTable.css";
import { AiFillDelete, AiFillEdit, AiOutlineMail } from "react-icons/ai";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Search from "./Search";

function ShipmentTable() {
  const [shipments, setShipments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [email, setEmail] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [category, setCategory] = useState("");
  const [id, setId] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3500/shipment/shipments")
      .then((response) => {
        setShipments(response.data);
      })
      .catch((error) => {
        console.error("Error fetching shipments:", error);
      });
  }, []); 

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); 
  };

  const deleteShipment = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this supplier?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:3500/shipment/delete/${id}`);
        setShipments((prevShipments) =>
        prevShipments.filter((shipment) => shipment._id !== id)
        );
        toast.success("Supplier deleted successfully");
      } catch (error) {
        console.error("Error deleting supplier:", error);
        toast.error("Error deleting supplier");
      }
    }
  }

  const filteredShipment = shipments.filter(
    shipment =>
    shipment.supplier_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shipment.catogory.toUpperCase().includes(searchQuery.toUpperCase())
  );

  const sendEmail = async () => {
    try {
        const data = {
            email: email,
            supplier_name: supplierName,
            catogory: category,
            id: id
        };
        await axios.post(`http://localhost:3500/shipment/sending/${id}`, data);
        toast.success("Email sent successfully");

    } catch (error) {
        console.error("Error sending email:", error);
        toast.error("Email already send");
    }
};

  return (
    <div>
      <Search setSearchQuery={setSearchQuery}/>
      <div className="ST_details">
        <div className="ST_supplier">
          <div class="ST_cardHeader">
            <span className="ST_cardName">Shipment List</span>
            <Link to="/shipment" className="ST_cardbt">Add Order</Link>
            <Link to="/shipment-report" className="ST_cardbtn">Shipment Report</Link>
          </div>
          <table>
            <thead>
              <tr>
                <td>No</td>
                <td>Shipping ID</td>
                <td>Supplier Name</td>
                <td>Category</td>
                <td>Email</td>
                <td>Order List</td>
                <td>Ordered Date</td>
                <td>Deliverd Date</td>
                <td>Status</td>
                <td>Action</td>
              </tr>
            </thead>

            <tbody>
              {filteredShipment.map((shipment, index) => (
                <tr key={shipment._id}>
                  <td>{index + 1}</td>
                  <td>{shipment._id}</td>
                  <td>{shipment.supplier_name}</td>
                  <td>{shipment.catogory}</td>
                  <td>{shipment.email}</td>
                  <td>
                    {shipment.order_list}
                  </td>
                  <td>{formatDate(shipment.ship_date)}</td> 
                  <td>{formatDate(shipment.delived_date)}</td> 
                  <td>
                  <span className={shipment.status === 'Pending' ? 'pending' : 
                  shipment.status === 'Received' ? 'received' :
                  shipment.status === 'Sending' ? 'sending'  :
                  shipment.status === 'Accepted' ? 'accepted'  :
                  shipment.status === 'Declined' ? 'declined'  :''}>{shipment.status}</span>
                  </td>
                  <td>
                    <Link to={`/updates/${shipment._id}`}><AiFillEdit id="ST_update-icon" /></Link>
                    <botton onClick={() => deleteShipment(shipment._id)}><AiFillDelete id ="ST_delete-icon"/></botton>
                    <botton onClick={() =>{
                      setId(shipment._id);
                      setEmail(shipment.email);
                      setSupplierName(shipment.supplier_name);
                      setCategory(shipment.catogory);
                      sendEmail();
                    }} disabled={shipment.status === 'Sending'|| shipment.status === 'Received'
                    || shipment.status === 'Accepted'|| shipment.status === 'Accepted'}><AiOutlineMail id ="ST_email-icon"/></botton>
                  </td> 
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default ShipmentTable;
