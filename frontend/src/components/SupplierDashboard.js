import React from "react";
import "../css/SupplierDashboard.css";
import Search from "./Search";

function Dashboard(){

    return(
        <div className="S_container">
            <div className="SS_title">
                <span>Suppliers</span>
            </div>
            <Search/>   
        </div>
    )

}
export default Dashboard;