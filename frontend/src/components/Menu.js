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
                    <Link to="#">
                        <span className="S_title ">Invite</span>
                    </Link >
                </li>

                <li>
                    <Link to='/display'>
                        <span className="S_title">Suppliers</span>
                    </Link>
                </li>

                <li>
                    <Link to="#">
                        <span className="S_title">Messages</span>
                    </Link >
                </li>

                <li>
                    <Link to="#">
                        <span className="S_title">Help</span>
                    </Link>
                </li>

                <li>
                    <Link to="#">
                        <span className="S_title">Settings</span>
                    </Link>
                </li>

                <li>
                    <Link to="#">
                        <span className="S_title">Password</span>
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