import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; 

export default function GetFeedbackForm() {
    const [rating, setRating] = useState('');
    const [comment, setComment] = useState('');
    const { id: orderId } = useParams(); 
    const navigate = useNavigate();

    const handleSubmit = async e => {
        e.preventDefault();

        try {
            const response = await axios.post(`http://localhost:8070/feedback/add`, {
                orderId,
                rating,
                comment
            });

            console.log(response.data); 
            navigate(`/order/${orderId}`); 

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="rating">Rating:</label>
            <input type="number" id="rating" value={rating} onChange={e => setRating(e.target.value)} />

            <label htmlFor="comment">Comment:</label>
            <textarea id="comment" value={comment} onChange={e => setComment(e.target.value)} />

            <button type="submit">Submit Feedback</button>
        </form>
   );
}