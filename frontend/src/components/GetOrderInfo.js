import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../GetOrderInfo.css";

export default function GetOrderInfo() {
  const [order, setOrder] = useState({});
  const [feedback, setFeedback] = useState([]);
  const { orderId } = useParams();

  const navigate = useNavigate();

  const navigateToAddFeedback = () => {
    navigate(`/order-details/${orderId}/add-feedback`);
  };

  const navigateToUpdateFeedback = (feedbackId) => {
    navigate(`/order-details/${orderId}/update-feedback/${feedbackId}`);
  };

  function deleteFeedback(feedbackId) {
    try {
      axios
        .delete(`http://localhost:8070/feedback/${feedbackId}`)
        .then(res => console.log(res.data))
        .catch(error => console.log(error));
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const fetchOrderAndFeedback = async () => {
      try {
        const [orderResponse, feedbackResponse] = await Promise.all([
          axios.get(`http://localhost:8070/order/${orderId}`),
          axios.get(`http://localhost:8070/feedback/${orderId}`) // Adjust the URL here
        ]);
  
        setOrder(orderResponse.data.order);
        setFeedback(feedbackResponse.data.feedback); // Update state 
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchOrderAndFeedback(); 
  }, [orderId]);

  return (
    <div className="order-info">
      <div className="order-info-container">
        {order._id ? ( // Check if order has an _id property
          <div className="order-item">
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>Meal:</strong> {order.base_name} with {order.portion_name ? order.portion_name.join(", ") : 'No portions selected'}</p> 
            <p><strong>Portion Size:</strong> {order.portion_size}</p>
            <p><strong>Quantity:</strong> {order.qty}</p>
            <p><strong>Date:</strong> {order.date.substring(0, 10)}</p>
            <p><strong>Time:</strong> {order.date.substring(11, 16)}</p>
            <p><strong>Total Amount:</strong> {order.total_amount}.00 LKR</p>
          </div>
        ) : (
          <div>Beep boop boop...</div>
        )}
      </div>
    <div className="feedback-container">
    {feedback ? ( // If feedback exists
        <div className="feedback-item">
            <p>Rating: {feedback.rating}</p>
            <p>Comment: {feedback.comment}</p>
            <div className="delete-feedback-btn" onClick={() => deleteFeedback(feedback._id)}>Delete</div>
            <div className="update-feedback-btn" onClick={() => navigateToUpdateFeedback(feedback._id)}>Update</div>  
        </div>
    ) : ( // If no feedback
        <button onClick={() => navigateToAddFeedback()}>Add Feedback</button> 
    )}
    </div>
    </div>
  );
}