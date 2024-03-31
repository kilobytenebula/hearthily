import React, { useState } from 'react';
import axios from 'axios';
import '../GetOrderInfo.css'
import { useParams, useNavigate } from 'react-router-dom';


export default function GetFeedbackForm() {
    const [rating, setRating] = useState('');
    const [comment, setComment] = useState('');
    const { orderId } = useParams(); 
    const navigate = useNavigate();

    const handleCancelClick = () => {
            navigate(`/order-history/order/${orderId}`);
    };

    const handleSubmit = async e => {
        e.preventDefault();

        try {
            const response = await axios.post(`http://localhost:8070/feedback/add`, {
                orderId,
                rating,
                comment
            });

            console.log(response.data); 
            navigate(`/order-history/order/${orderId}`); 

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="add-feedback-form-container">
            <label htmlFor="rating" className="form-label">Rating:</label> 
            <input type="number" id="rating" value={rating} onChange={e => setRating(e.target.value)} className="form-input" />

            <label htmlFor="comment" className="form-label">Comment:</label>
            <textarea id="comment" value={comment} onChange={e => setComment(e.target.value)} className="form-textarea" />

            <button type="submit" className="submit-button">Submit Feedback</button> 
            <button type="button" className="cancel-button" onClick={handleCancelClick}>Cancel</button> 
        </form>
    );
}