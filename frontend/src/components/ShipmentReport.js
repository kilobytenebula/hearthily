import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import "../css/ShipmentReport.css";

function ShipmentReport() {
  const [shipments, setShipments] = useState([]);
  const ComponentRef = useRef();
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    // Fetch shipments from backend based on the selected status filter
    axios
      .get(`http://localhost:3500/shipment/shipments/${statusFilter}`)
      .then((response) => {
        setShipments(response.data);
      })
      .catch((error) => {
        console.error("Error fetching shipments:", error);
      });
  }, [statusFilter]); // Fetch shipments whenever status changes

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handlePrints = useReactToPrint({
    content: () => ComponentRef.current,
    documentTitle: "Shipment Report",
    onAfterPrint: () => alert("Shipment Report Successfully Download"),
  });

   // Function to handle radio button change
   const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  return (
    <div>
      <div className="filter-container">
        <label htmlFor="All">
          <input type="radio" id="all" name="status" value="" checked={!statusFilter} onChange={handleStatusFilterChange} />
          All Orders
        </label>

        <label htmlFor="Pending">
          <input type="radio" name="status" value="Pending" checked={statusFilter === "Pending"} onChange={handleStatusFilterChange} />
          Pending
        </label>

        <label htmlFor="Accepted">
          <input type="radio" id="Accepted" name="status" value="Accepted" checked={statusFilter === "Accepted"} onChange={handleStatusFilterChange} />
          Accepted
        </label>

        <label htmlFor="Declined">
          <input type="radio" id="Declined" name="status" value="Declined" checked={statusFilter === "Declined"} onChange={handleStatusFilterChange} />
          Declined
        </label>

        <label htmlFor="received">
          <input type="radio" id="received" name="status" value="Received" checked={statusFilter === "Received"} onChange={handleStatusFilterChange} />
          Received
        </label>
      </div>

      <div ref={ComponentRef} className="SSR_details">
        <div className="SSR_supplier">
          <div className="SSR_cardHeader">
            <span className="SSR_cardName">Shipment Report</span>
          </div>
          <table>
            <thead>
              <tr>
                <td>No</td>
                <td>Shipment Id</td>
                <td>Supplier Name</td>
                <td>Category</td>
                <td>Order List</td>
                <td>Order Date</td>
                <td>Status</td>
              </tr>
            </thead>
            <tbody>
              {shipments.map((shipment, index) => (
                <tr key={shipment._id}>
                  <td>{index+1}</td>
                  <td>{shipment._id}</td>
                  <td>{shipment.supplier_name}</td>
                  <td>{shipment.catogory}</td>
                  <td>{shipment.order_list}</td>
                  <td>{formatDate(shipment.ship_date)}</td>
                  <td>{shipment.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <button onClick={handlePrints} className="SSR_print-button">
        Print PDF
      </button>
    </div>
  );
}

export default ShipmentReport;
