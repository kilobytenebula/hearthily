import React, { useState, useEffect } from "react";
import {Link, useParams} from 'react-router-dom'
import axios from "axios";
import '../css/refundRequests.css';
const download = require('../icons/download.png')


export default function RefundRequest(){

    const [refunds, setPayments] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(()=>{

        function getRefunds(){
            axios.get(`http://localhost:3500/refund`)
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
            const response = await axios.put(`http://localhost:3500/refund/update/${orderId}`, { isSuccess });
            window.location.reload();
        } catch (error) {
            console.error('Error updating payment:', error);
        }
    };
    const handleUpdateRefund = (orderId, isSuccess) => {
        updateRefund(orderId, isSuccess);
     
    };

    const handleDownloadClick = (imageURL) => {

        const newWindow = window.open();
        newWindow.document.write(
            '<html><head><title>Image Preview</title></head><body style="margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh;"><img src="' 
            + imageURL + '" style="max-width: 100%; max-height: 100%;"></body></html>');
        
      };
      const filteredRefunds = refunds.filter(refund =>
        refund.orderId.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return(

        <div className="allRefundsContainer">
            <div className="header">
                
                    <div className="titile">Refund Requests</div>
                    <div className="refundSearchBar">
                        <input 
                            type="search" 
                            placeholder="Search by Order Id..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                 </div>
            </div>

            <div className="refundsReqList">
                {filteredRefunds.map((refund, index) => (
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
                        {refund.image && (
                            <div className="image">
                                <div className="title">Images</div>
                                <i className="your-icon-class" onClick={() => handleDownloadClick(refund.image.data)}>       
                                    <div>Click View</div>
                                </i>
                            </div>
                        )}
                        <div className="status">
                            <div className="title">Status</div>
                            <div className="value">{refund.isSuccess}</div>
                        </div>

                        {refund.isSuccess !== "accepted" && ( // Conditionally render action buttons if isSuccess is not "accepted"
                            <div className="actions">
                                <button className="accept" onClick={() => handleUpdateRefund(refund.orderId, "accepted")}>Accept</button>
                                <button className="decline" onClick={() => handleUpdateRefund(refund.orderId, "declined")}>Decline</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            
        </div>
    )
}