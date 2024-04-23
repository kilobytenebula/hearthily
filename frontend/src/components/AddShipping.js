import React from "react";
import Menu2 from "./Menu";
import "../css/AllSupplier.css";
import OrderForm from "./OrderForm";

function AddShipping() {
    const today = new Date(); // Get current date
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = today.toLocaleDateString(undefined, options); // Format date as Monday, January 1, 2023
  
    return (
      <div className="S_container">
        <Menu2 />
        <div className="SS_title">
          <span>Make a Shipping</span>
          <span className="date">{formattedDate}</span>
        </div>
        <OrderForm/>
      </div>
    );
  }

export default AddShipping;