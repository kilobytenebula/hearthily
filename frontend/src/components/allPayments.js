import React, { useState, useEffect } from "react";
import {Link, useParams} from 'react-router-dom'
import axios from "axios";
import '../allPayments.css';

export default function AllPayments() {
    const [payments, setPayments] = useState([]);
    const customerId = "6607de0ae6da274300367544";

    useEffect(() => {
        function getPayments() {
            axios.get(`http://localhost:8050/payment/${customerId}`)
                .then((res) => {
                    console.log(res.data);
                    setPayments(res.data);
                })
                .catch((err) => {
                    alert(err.message);
                });
        }
        getPayments();
    }, [customerId]);

    

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
                            <Link to={`/reqRefun/${payment.orderId}`} className="refund-button">Request Refund</Link>
                        </div>
                    </div>   
                ))}
            </div>
        </div>
    );
}
