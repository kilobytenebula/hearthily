import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../GetOrderInfo.css'; // Assuming the relevant CSS file
import { useParams, useNavigate } from 'react-router-dom';

export default function UpdateFeedback() {
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [feedbackId, setFeedbackId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { orderId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeedback = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`http://localhost:8070/feedback/${orderId}`);
        const feedbackData = response.data; 
  
        console.log('Full Response Object:', response.data); // Log 1 
  
        setRating(feedbackData.feedback.rating);
        setComment(feedbackData.feedback.comment);
        setFeedbackId(feedbackData.feedback._id);
  
        setTimeout(() => console.log('Feedback State:', feedbackData), 3000); // Log 3
  
      } catch (error) {
        console.error("Error fetching feedback:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchFeedback();
  }, [orderId]);

  const handleCancelClick = () => {
    navigate(`/order-history/order/${orderId}`);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const response = await axios.put(`http://localhost:8070/feedback/${feedbackId}`, {
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
    <div>
      {isLoading ? (
        <div>Loading feedback...</div>
      ) : (
        <form onSubmit={handleSubmit} className="add-feedback-form-container">
          <label htmlFor="rating" className="form-label">Rating:</label> 
          <input type="number" id="rating" value={rating || ''} onChange={e => setRating(e.target.value)} className="form-input" />

          <label htmlFor="comment" className="form-label">Comment:</label>
          <textarea id="comment" value={comment || ''} onChange={e => setComment(e.target.value)} className="form-textarea" />

          <button type="submit" className="submit-button">Update Feedback</button> 
          <button type="button" className="cancel-button" onClick={handleCancelClick}>Cancel</button> 
        </form>
      )}
    </div>
  );
}
