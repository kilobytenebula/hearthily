import React from "react";
import "../pages/InvitedSupplier.css";
import Menu2 from "./Menu";
import InvitationTable from "./InvitationTable";


function InvitedSupplier() {
    const today = new Date(); // Get current date
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = today.toLocaleDateString(undefined, options); // Format date as Monday, January 1, 2023
  
    return (
      <div className="S_container">
        <Menu2/>
        <div className="SS_title">
          <span>Invitation to supplier</span>
          <span className="date">{formattedDate}</span>
        </div>
        <InvitationTable/>
      </div>
    )
  }
export default InvitedSupplier;