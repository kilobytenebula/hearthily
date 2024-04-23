import React from "react";
import "../css/SupplierDashboard.css";
import Menu from "./Menu";
import Search from "./Search";

function Dashboard(){

    return(
        <div className="S_container">
            <Menu/>
            <div className="SS_title">
                <span>Suppliers</span>
            </div>
            <Search/>   
        </div>
    )

}
export default Dashboard;