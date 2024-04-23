import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/ShipmentTable.css";
import { AiFillDelete, AiFillEdit, AiFillEye, AiOutlineMail } from "react-icons/ai";
import { Link } from "react-router-dom";
import Search from "../components/Search";

function ShipmentTable() {
  const [shipments, setShipments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Fetch shipment details from backend when the component mounts
    axios.get("http://localhost:3500/shipment/displays")
      .then((response) => {
        setShipments(response.data);
      })
      .catch((error) => {
        console.error("Error fetching shipments:", error);
      });
  }, []); 

   // Function to format date
   const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); 
  };

  // Function to prompt PDF content
  const promptPDFContent = async (orderId) => {
    try {
      const response = await axios.get(`http://localhost:3500/shipment/get/${orderId}`, { responseType: 'arraybuffer' });
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl);
    } catch (error) {
      console.error("Error fetching PDF content:", error);
      alert("Error fetching PDF content");
    }
  };

  //delete shipment
  const deleteShipment = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this supplier?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:3500/shipment/delete/${id}`);
        setShipments((prevShipments) =>
        prevShipments.filter((shipment) => shipment._id !== id)
        );
        alert("Supplier deleted successfully");
      } catch (error) {
        console.error("Error deleting supplier:", error);
        alert("Error deleting supplier");
      }
    }
  }

  //search shipment
  const filteredShipment = shipments.filter(
    shipment =>
    shipment.supplier_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shipment.catogory.toUpperCase().includes(searchQuery.toUpperCase())
  );

  return (
    <div>
      <Search setSearchQuery={setSearchQuery}/>
      <div className="ST_details">
        <div className="ST_supplier">
          <div className="ST_cardHeader">
            <span className="ST_cardName">Order List</span>
          </div>
          <table>
            <thead>
              <tr>
                <td>Shipping ID</td>
                <td>Supplier Name</td>
                <td>Category</td>
                <td>Email</td>
                <td>Order List</td>
                <td>Order Date</td>
                <td>Status</td>
                <td>Action</td>
              </tr>
            </thead>

            <tbody>
              {filteredShipment.map((shipment, index) => (
                <tr key={shipment._id}>
                  <td>{index+1000}</td>
                  <td>{shipment.supplier_name}</td>
                  <td>{shipment.catogory}</td>
                  <td>{shipment.email}</td>
                  <td>
                    {shipment.order_list}
                    <botton onClick={() => promptPDFContent(shipment._id)}><AiFillEye id ="ST_view-icon"/></botton>
                  </td>
                  <td>{formatDate(shipment.ship_date)}</td> 
                  <td>{shipment.status}</td>
                  <td>
                    <Link to={`/updates/${shipment._id}`}><AiFillEdit id="ST_update-icon" /></Link>
                    <botton onClick={() => deleteShipment(shipment._id)}><AiFillDelete id ="ST_delete-icon"/></botton>
                    <Link to={`/displays/${shipment._id}`}><AiOutlineMail id="ST_email-icon" /></Link>
                  </td> 
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ShipmentTable;
