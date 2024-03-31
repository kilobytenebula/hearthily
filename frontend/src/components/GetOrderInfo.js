import React, { useEffect, useState } from "react";
import copy from 'clipboard-copy';
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../GetOrderInfo.css";
import AddFeedback from "./AddFeedback";
const copyicon = require('../icons/copyicon.png');

export default function GetOrderInfo() {
  const [order, setOrder] = useState({});
  const [feedback, setFeedback] = useState([]);
  const [copyOrderId, setCopyOrderId] = useState('Copy to clipboard');
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [showAddFeedbackForm, setShowAddFeedbackForm] = useState(false);

  const handleAddFeedbackClick = () => {
    setShowAddFeedbackForm(true); 
  };

  const navigateToAddFeedback = () => {
    navigate(`/order-history/order/${orderId}/add-feedback`);
  };

  const navigateToUpdateFeedback = (orderId) => {
    navigate(`/order-history/order/${orderId}/update-feedback/${orderId}`);
  };

  function getSizeClass(size) {
    const sizeMap = {
      F: 'Full',
      N: 'Normal'
    };

    return sizeMap[size] || '';
  }

  function handleCopyClick() {
    copy(order._id)
      .then(() => {
        setCopyOrderId('Copied!');
        setTimeout(() => setCopyOrderId(''), 1000);
      })
      .catch(() => {
        setCopyOrderId('Error copying!');
      });
  }  

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
    <div>
      <div className="top-bar">
        <div className="container-title-text">Order Details</div>
      </div>
    <div className="order-info">
        {order._id ? ( // Check if order has an _id property
          <div className="order-info-container">
            <div className="order-header">
              <div className="order-id"><div>Order ID :</div> {order._id}
                <div className="copy-container" onClick={handleCopyClick}>
                    <img src={copyicon} alt="copy"></img>
                    <span className="tooltiptext">{copyOrderId}</span>
                </div>
              </div>
              <div className="date-time">{order.date.substring(0, 10)} {order.date.substring(11, 16)}</div>
            </div>
            <div className="order-info-add">
              <div className="meal-name">
              <div>{order.base_name} with {order.portion_name ? order.portion_name.join(", ") : 'No portions selected'}</div>
              <div>({getSizeClass(order.portion_size)})</div>
              </div>
              <div className="qty-row">Quantity : <div>{order.qty}</div></div>
            </div>
            <div className="order-payment-info">
              <div className="order-info-row"><div>Total Amount :</div> <div>{order.total_amount}.00 LKR</div></div>
            </div>
          </div>
        ) : (
          <div className="order-info-container"><div className="loading-text">Beep boop boop...</div></div>
        )}
    <div className="feedback-container">
    {feedback ? ( // If feedback exists
        <div className="feedback-item">
            <div className="order-info-row"><div>Rating:</div> <div>{feedback.rating}</div></div>
            <div className="order-info-row"><div className="comment-container"><div>Comment:</div> <div className="comment-text">{feedback.comment}</div></div></div>
            <div className="order-info-row">
              <div className="feedback-btns">
                <div className="delete-feedback-btn" onClick={() => deleteFeedback(feedback._id)}>Delete</div>
                <div className="update-feedback-btn" onClick={() => navigateToUpdateFeedback(order._id)}>Update</div> 
              </div> 
            </div> 
        </div>
    ) : ( // If no feedback
       <>
           <div className="no-feedback-container">
            <div>Help us improve! Leave your feedback.</div>
            <div className='add-feedback-btn' onClick={navigateToAddFeedback}>Add Feedback</div> 
           </div>
           {showAddFeedbackForm && (
               <AddFeedback orderId={orderId} onClose={() => setShowAddFeedbackForm(false)} />
           )}
       </>  
  )}
    </div>
    </div>
    </div>
  );
}