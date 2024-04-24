import React, { useState, useEffect } from "react";
import {Link, useParams} from 'react-router-dom'
import axios from "axios";
import '../css/requestedRefunds.css';


export default function RequestedRefunds() {

    const [refunds, setRefunds] = useState([]);
    const customerId = "609c9c918c27e038b0e27b2d";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:3500/refund/${customerId}`);
                setRefunds(response.data);
            } catch (error) {
                console.error("Error fetching refunds:", error);
            }
        };
        fetchData();
    }, [customerId]);

    const handleDelete = async (refundId) => {
        try {
            // Make delete request to your backend API with the refundId
            await axios.delete(`http://localhost:3500/refund/delete/${refundId}`);
            // After successful deletion, fetch refunds again to update the UI
            const response = await axios.get(`http://localhost:3500/refund/${customerId}`);
            setRefunds(response.data);
        } catch (error) {
            console.error("Error deleting refund:", error);
        }
    };



    return(
        <div className="reqRefundsBody">
            <div>
            {refunds.length > 0 ? (
                <div className="refundsBody">
                    {refunds.map((refund) => (
                        <div className="refunds" key={refund._id}>
                            <div className="refundRow">
                                <div className="rTitle">Refund ID</div>
                                <div className="rvalue">{refund._id}</div>
                            </div>
                            <div className="refundRow">
                                <div className="rTitle"> Mobile Number</div>
                                <div className="rvalue">{refund.mobileNumber}</div>
                            </div>
                            <div className="refundRow">
                                <div className="rTitle">Order ID</div>
                                <div className="rvalue">{refund.orderId}</div>
                            </div>
                            <div className="refundRow">
                                <div className="rTitle">Reason</div>
                                <div className="rvalue">{refund.reason}</div>
                            </div>
                            <div className="refundRow">
                                <div className="rTitle">Description</div>
                                <div className="rvalue">{refund.description}</div>
                            </div>
                            <div className="refundRow">
                                <div className="rTitle">Success Status</div>
                                <div className="rvalue">{refund.isSuccess}</div>
                            </div>
                            {refund.isSuccess !== "accepted" && (
                                    
                                    <div className="delete">
                                        {/* <div><Link to={`/reqRefun/${}`} className="refund-button">Request Refund</Link></div> */}
                                        <button onClick={() => handleDelete(refund._id)}>Delete</button>
                                    </div>
                                    
                                )}
                        </div>
                    ))}
                </div>
            ) : (
                <p>No refunds found</p>
            )}
            </div>

        </div>
    )
}