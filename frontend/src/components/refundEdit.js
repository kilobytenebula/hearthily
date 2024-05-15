import React, { useState, useEffect } from "react";
import { NavigationType, useParams } from 'react-router-dom';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import '../css/refundEdit.css';

export default function EditRefund() {
    const { id } = useParams();
    const [refundDetails, setRefundDetails] = useState(null);
    const [editedDetails, setEditedDetails] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const apiUrl = `http://localhost:3500/refund/get/${id}`;

        axios.get(apiUrl)
            .then(response => {
                const { mobileNumber, reason, description } = response.data;
                setRefundDetails({ mobileNumber, reason, description });
                setEditedDetails({ mobileNumber, reason, description });
            })
            .catch(error => {
                console.error('Error retrieving refund:', error);
                // Handle error here
            });

    }, [id]);



    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedDetails({ ...editedDetails, [name]: value });
    };

    // Placeholder values to display while refundDetails are being fetched
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Send editedDetails to your API to update the refund details
        const apiUrl = `http://localhost:3500/refund/refundEdit/${id}`;
        axios.put(apiUrl, editedDetails)
            .then(response => {
                console.log('Updated refund details:', response.data);
                navigate('/requestedRefunds');
            })
            .catch(error => {
                console.error('Error updating refund:', error);
                // Handle error
            });
    };

    return (
        <div className="reqRefundsBody">
            <form onSubmit={handleSubmit}>
                <div className="inputField">
                <label htmlFor="mobileNumber">Mobile Number:</label>
                <input
                    type="text"
                    className="inputBox"
                    id="number"
                    name="mobileNumber"
                    value={editedDetails.mobileNumber}
                    onChange={handleChange}
                />
                </div>
                <div className="inputField">
                <label for="reason">Reason</label>
                <select
                    id="reason"
                    className=" editReason"
                    name="reason"
                    value={editedDetails.reason}
                    onChange={handleChange}
                >
                    <option value="" disabled>Select a reason</option>
                    <option value="wrong_order">Wrong Order</option>
                    <option value="poor_quality">Poor Quality</option>
                    <option value="other">Other</option>
                </select>
                </div>
                <div className="inputField">
                <label htmlFor="description">Description:</label>
                <textarea
                    id="description"
                    name="description"
                    value={editedDetails.description}
                    onChange={handleChange}
                />
                </div>
                <br />
                <div className="submitFormContainer">
                    <button className="submitForm" type="submit">Save Changes</button>
                    </div>
            </form>
        </div>
    )
}
