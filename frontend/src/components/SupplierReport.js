import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import "../css/SupplierReport.css";

function SupplierReport() {
    const { id } = useParams();
    const ComponentRef = useRef();
    const [supplier_name, setName] = useState("");
    const [category, setCat] = useState("");
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    const [phone_n, setPhone] = useState("");
    const [reg_date, setDate] = useState("");

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(`http://localhost:3500/supplier/display/${id}`);
                const supplier = response.data.supplier;

                setName(supplier.supplier_name);
                setCat(supplier.catogory);
                setAddress(supplier.address);
                setEmail(supplier.email);
                setPhone(supplier.phone_n);
                const formattedDate = new Date(supplier.reg_date).toISOString().split('T')[0];
                setDate(formattedDate);

            } catch (error) {
                console.error("Error fetching supplier:", error);
            }
        }
        fetchData();
    }, [id]);

    const handlePrint = useReactToPrint({
        content: () => ComponentRef.current,
        documentTitle:"Supplier Report",
        onAfterPrint:()=> {
            alert("Supplier Report Successfully Download");
            window.location.href = "/display";// Navigate to the second page
        }
    });

    return (
        <div className="S_R_report-container">
            <div ref={ComponentRef} >
                <h2 className="S_R_details">Supplier Details</h2>
                <div className="S_R_detail">
                    <span className="S_R_label">Name:</span>
                    <span className="S_R_value">{supplier_name}</span>
                </div>
                <div className="S_R_detail">
                    <span className="S_R_label">Category:</span>
                    <span className="S_R_value">{category}</span>
                </div>
                <div className="S_R_detail">
                    <span className="S_R_label">Address:</span>
                    <span className="S_R_value">{address}</span>
                </div>
                <div className="S_R_detail">
                    <span className="S_R_label">Email:</span>
                    <span className="S_R_value">{email}</span>
                </div>
                <div className="S_R_detail">
                    <span className="S_R_label">Phone Number:</span>
                    <span className="S_R_value">{phone_n}</span>
                </div>
                <div className="S_R_detail">
                    <span className="S_R_label">Register Date:</span>
                    <span className="S_R_value">{reg_date}</span>
                </div>
            </div>
            <button onClick={handlePrint} className="S_R_print-button">Print PDF</button>
        </div>

    );
}

export default SupplierReport;