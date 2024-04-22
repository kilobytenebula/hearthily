import React from "react";
import "../style/Menu.css";
import { Link } from "react-router-dom";
const logo = require('../icons/logo.png');

function Menu() {

    return(
        <div className="S_navigation">
            <ul>
                <li>
                    <Link to ="#">
                        <span className="S_title "><img src = {logo}></img></span>
                    </Link>
                </li>

                <li>
                    <Link to="/">
                        <span className="S_title">Dashbroad</span>
                    </Link>
                </li>

                <li>
                    <Link to='/invite'>
                        <span className="S_title ">Invitations</span>
                    </Link >
                </li>

                <li>
                    <Link to='/display'>
                        <span className="S_title">Suppliers</span>
                    </Link>
                </li>

                <li>
                    <Link to="/shipment">
                        <span className="S_title">Shippings</span>
                    </Link >
                </li>

                <li>
                    <Link to="/displays">
                        <span className="S_title">Shipment</span>
                    </Link>
                </li>

                <li>
                    <Link to="#">
                        <span className="S_title"></span>
                    </Link>
                </li>

                <li>
                    <Link to="#">
                        <span className="S_title">Sign Out</span>
                    </Link>
                </li>
            </ul>
        </div>
        
    )  
}

export default Menu;