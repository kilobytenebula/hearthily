import React from "react";
import "../pages/SupplierDashboard.css";
import Menu from "../components/Menu";
import Search from "../components/Search";

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