import React from "react";
import SupplierTable from "./SupplierTable";
import "../css/AllSupplier.css";

function AllSupplier() {
    const today = new Date(); // Get current date
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = today.toLocaleDateString(undefined, options); // Format date as Monday, January 1, 2023
  
    return (
      <div className="S_container">
        <div className="SS_title">
          <span>Suppliers</span>
          <span className="date">{formattedDate}</span>
        </div>
        <SupplierTable />
      </div>
    );
  }

export default AllSupplier;