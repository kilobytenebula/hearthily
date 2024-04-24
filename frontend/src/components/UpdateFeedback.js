import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css';
import '../css/GetOrderInfo.css';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

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
        const response = await axios.get(`http://localhost:3500/feedback/${orderId}`);
        const feedbackData = response.data; 

        setRating(feedbackData.feedback.rating);
        setComment(feedbackData.feedback.comment);
        setFeedbackId(feedbackData.feedback._id);

      } catch (error) {
        console.error("Error fetching feedback:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedback();
  }, [orderId]);

  const starRating = () => {
    return (
        <div className='star-rating-container'>
            {[...Array(5)].map((star, i) => {
                const ratingValue = i + 1;
                return (
                <label key={ratingValue} required>
                    <input className='ratings-radio' type="radio"
                    name="rating" value={ratingValue} onClick={() => setRating(ratingValue)} />
                    <FaStar className='star' size={30} style={{ color: ratingValue <= rating ? "#F28638" : "#252836" }}/>
                </label>
                );
            })}
        </div>
    )
};

  const handleCancelClick = () => {
    navigate(`/order-history/order/${orderId}`);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!rating || !comment) {
      toast.error('Please provide both a rating and a comment.');
      return;
    }

    try {
      await axios.put(`http://localhost:3500/feedback/${feedbackId}`, {
        orderId,
        rating,
        comment
      });

      navigate(`/order-history/order/${orderId}?feedbackUpdateSuccess=true`); // Pass query parameter for success

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='add-feedback-main'>
       <ToastContainer /> {/* ToastContainer for displaying toast messages */}
       <div className="top-bar">
        <div className="container-title-text">Update Your Feedback</div>
      </div>
      {isLoading ? (
        <div className="order-info-container-update"><div className="loading-text">Beep boop boop...</div></div>
      ) : (
        <form onSubmit={handleSubmit} className="add-feedback-form-container">
          <div className='star-rating'>{starRating()}</div>

          <label htmlFor="comment" className="form-label">Comment:</label>
          <textarea id="comment" value={comment || ''}
            onChange={e => setComment(e.target.value)}
            className="form-textarea"placeholder="Type your feedback"/>
          <div className='form-buttons'>
            <button type="submit" className="submit-button">Update Feedback</button> 
            <button type="button" className="cancel-button" onClick={handleCancelClick}>Cancel</button> 
          </div>
        </form>
      )}
    </div>
  );
}