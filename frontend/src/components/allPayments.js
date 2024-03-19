import React, { useState, useEffect } from "react";
import axios from "axios";
import '../allPayments.css';

export default function AllPayments() {
    const [payments, setPayments] = useState([]);

    useEffect(() => {
        function getPayments() {
            axios.get("http://localhost:8050/payment/")
                .then((res) => {
                    console.log(res.data);
                    setPayments(res.data);
                })
                .catch((err) => {
                    alert(err.message);
                });
        }
        getPayments();
    }, []);

    return (
        <div className="frame">
        <div className="titleBar">
            <div className="heading">Payment History</div>
            <div></div>
        </div>
        <div className="allPaymentContainer">
           {payments.map((payment, index) => (
            <div className="PaymentContainer" key={index}>
                <div className="paymentInfo">
                    <div className="strong">Order ID</div>
                    <div>Will implement</div>
                 </div>
                 <div className="paymentInfo">
                    <div className="strong">Meal</div>
                    <div>Will implement</div>
                 </div>
                <div className="paymentInfo">
                    <div className="strong">Total Price</div>
                    <div>{payment.amount}</div>
                 </div>
                <div className="paymentInfo">
                    <div className="strong">Time Ordered</div>
                     <div>{payment.date}</div>
                 </div>
                <div className="paymentInfo">
                    <div className="strong">Payment Method</div>
                    <div>{payment.paymentMethod}</div>
                </div>
                <div className="paymentInfo">
                    <div className="strong">Payment Status</div>
                     <div>{payment.isSuccess ? "Completed" : "Pending"}</div>
                 </div>
                 <div className="paymentInfo">
                    <div></div>
                     <button className="button" ><div className="apply">Request Refund</div></button>
                </div>
             </div>   
            ))}
            
        </div>
        </div>
    );
}
