import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import "../css/SendOrder.css";

function SendOrder() {
    const { id } = useParams();
    const ComponentRef = useRef();
    const [supplier_name, setName] = useState("");
    const [catogory, setCat] = useState("");
    const [email, setEmail] = useState("");
    const [order_list, setOrder] = useState("");
    const [ship_date, setDate] = useState("");

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(`http://localhost:3500/shipment/displays/${id}`);
                const shipment = response.data.shipment;

                setName(shipment.supplier_name);
                setCat(shipment.catogory);
                setEmail(shipment.email);
                setOrder(shipment.order_list);
                const formattedDate = new Date(shipment.ship_date).toISOString().split('T')[0];
                setDate(formattedDate);
            } catch (error) {
                console.error("Error fetching shipment:", error);
            }
        }
        fetchData();
    }, [id]);

    const sendEmail = async () => {
        try {
            await axios.post(`http://localhost:3500/shipment/sending`);
            alert("Email sent successfully");
        } catch (error) {
            console.error("Error sending email:", error);
            alert("Failed to send email");
        }
    };

    const handlePrint = useReactToPrint({
        content: () => ComponentRef.current,
        documentTitle:"Supplier Report",
        onAfterPrint:()=>alert("Supplier Report Successfully Download")
    });

    return (
        <div className="S_R_report-container">
            <h2 className="S_R_details">Order Details</h2>
            <div className="S_R_detail">
                <span className="S_R_label">Name:</span>
                <span className="S_R_value">{supplier_name}</span>
            </div>
            <div className="S_R_detail">
                <span className="S_R_label">Category:</span>
                <span className="S_R_value">{catogory}</span>
            </div>
            <div className="S_R_detail">
                <span className="S_R_label">Email:</span>
                <span className="S_R_value">{email}</span>
            </div>
            <div className="S_R_detail">
                <span className="S_R_label">Order List:</span>
                <span className="S_R_value">{order_list}</span>
            </div>
            <div className="S_R_detail">
                <span className="S_R_label">Shipping Date:</span>
                <span className="S_R_value">{ship_date}</span>
            </div>
            <button onClick={sendEmail} className="S_R_print-button">Send Email</button>
        </div>

    );
}

export default SendOrder;