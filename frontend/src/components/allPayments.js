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
                    setPayments(res.data);
                })
                .catch((err) => {
                    alert(err.message);
                });
        }
        getPayments();
    }, [customerId]);

    const [meals, setMeals] = useState({});

    useEffect(() => {
        const fetchMealDetails = async () => {
            const mealDetails = {};
            for (const payment of payments) {
                try {
                    const response = await axios.get(`http://localhost:8050/order/${payment.orderId}`);
                    mealDetails[payment.orderId] = response.data[0].base_name;                ;
                } catch (error) {
                    console.error("Error fetching meal details:", error);
                }
            }
            console.log(mealDetails);
            setMeals(mealDetails);
        };

        // Call fetchMealDetails only when payments state changes
        if (payments.length > 0) {
            fetchMealDetails();
        }
    }, [payments]);




    return (
        <div className="frame">
            <div className="titleBar">
                <div className="heading">Payment History</div>
                <div>
                    <Link to="/requestedRefunds" className="requestedRefunds">Requested Refunds</Link>
                </div>
            </div>
            <div className="allPaymentContainer">
                {payments.map((payment, index) => (
                    <div className="PaymentContainer" key={index}>
                        <div className="paymentInfo">
                            <div className="strong">Order ID</div>
                            <div>{payment.orderId}</div>
                        </div>
                        <div className="paymentInfo">
                            <div className="strong">Meal</div>
                            <div>{meals[payment.orderId] || "Loading..."}</div>
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
                            <div>{payment.isSuccess === "pending" ? "Pending" :
                                    payment.isSuccess === "approved" ? "Approved" :
                                    payment.isSuccess === "rejected" ? "Rejected" :
                                    "Unknown Status"}</div>
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
