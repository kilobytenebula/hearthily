import React, { useState, useEffect } from "react";
import {Link, useParams} from 'react-router-dom'
import axios from "axios";
import '../refundRequests.css';


export default function RefundRequest(){

    const [refunds, setPayments] = useState([]);

    useEffect(()=>{

        function getRefunds(){
            axios.get(`http://localhost:8050/refund`)
                .then((res) => {
                    console.log(res.data);
                    setPayments(res.data);
                })
                .catch((err) => {
                    alert(err.message);
                });
        }
        getRefunds();
    },[])

    const updateRefund = async (orderId, isSuccess) => {
        try {
            const response = await axios.put(`http://localhost:8050/refund/update/${orderId}`, { isSuccess });
            console.log(response.data); // Log the response from the API
        } catch (error) {
            console.error('Error updating payment:', error);
        }
    };
    const handleUpdateRefund = (orderId, isSuccess) => {
        updateRefund(orderId, isSuccess);
     
    };

    return(

        <div className="allRefundsContainer">
            <div className="header">
                
                    <div className="titile">Refund Requests</div>
                    <div className="refundSearchBar">
                        <input 
                            type="search" 
                            placeholder="Search by Order Id..." 
                            
                        />
                        <button>Search</button>
                 </div>
            </div>

            <div className="refundsReqList">
                {refunds.map((refund, index) => (
                    <div className="refundReq" key={index}>
                        <div className="cid">
                            <div className="title">Customer ID</div>
                            <div className="value">{refund.customerId}</div>
                        </div>
                        <div className="oid">
                            <div className="title">Order ID</div>
                            <div className="value">{refund.orderId}</div>
                        </div>
                        <div className="phone">
                            <div className="title">Contact Number</div>
                            <div className="value">{refund.mobileNumber}</div>
                        </div>
                        <div className="reason">
                            <div className="title">Reason</div>
                            <div className="value">{refund.reason}</div>
                        </div>
                        <div className="des">
                            <div className="title">Description</div>
                            <div className="value">{refund.description}</div>
                        </div>
                        <div className="status">
                            <div className="title">Status</div>
                            <div className="value">{refund.isSuccess}</div>
                        </div>

                        {refund.isSuccess !== "accepted" && ( // Conditionally render action buttons if isSuccess is not "accepted"
                            <div className="actions">
                                <button className="accept" onClick={() => handleUpdateRefund(refund.orderId, "accepted")}>Accept</button>
                                <button className="Decline" onClick={() => handleUpdateRefund(refund.orderId, "declined")}>Decline</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            
        </div>
    )
}