import React, { useEffect, useState } from "react";
import copy from 'clipboard-copy';
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "../css/GetOrderInfo.css";
import AddFeedback from "./AddFeedback";
import { FaStar } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DocumentTitle from "./DocumentTitle";

const copyicon = require('../icons/copyicon.png');

export default function GetOrderInfo() {
  const [order, setOrder] = useState({});
  const [feedback, setFeedback] = useState([]);
  const [copyOrderId, setCopyOrderId] = useState('Copy to clipboard');
  const { orderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [showAddFeedbackForm, setShowAddFeedbackForm] = useState(false);

  const navigateToAddFeedback = () => {
    navigate(`/order-history/order/${orderId}/add-feedback`);
  };

  const navigateToUpdateFeedback = (orderId) => {
    navigate(`/order-history/order/${orderId}/update-feedback/${orderId}`);
  };

  DocumentTitle("Order Details");

  function starRating(currentRating) {
    return (
      <div className='star-rating-container-info'>
        {[...Array(5)].map((star, i) => {
          const ratingValue = i + 1;
          return (
            <label key={ratingValue}>
              <FaStar className='star' size={30}
                style={{ color: ratingValue <= currentRating ? "#F28638" : "#252836" }} />
            </label>
          );
        })}
      </div>
    )
  };

  function getSizeClass(size) {
    const sizeMap = {
      F: 'Full',
      R: 'Regular'
    };

    return sizeMap[size] || '';
  }

  function formatAMPM(date) {
    const dateObj = new Date(date);

    let hours = dateObj.getHours();
    let minutes = dateObj.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12;

    minutes = minutes < 10 ? '0' + minutes : minutes;
    const strTime = hours + ':' + minutes + ' ' + ampm;

    return strTime;
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
    if (!window.confirm('Are you sure you want to delete this feedback?')) {
      return;
    }
    try {
      axios
        .delete(`http://localhost:3500/feedback/${feedbackId}`)
        .then(res => {
          console.log(res.data);
          // Show toast message
          toast.success('Feedback deleted successfully!');
          // Refetch feedback data
          axios.get(`http://localhost:3500/feedback/${orderId}`)
            .then(response => {
              setFeedback(response.data.feedback);
            })
            .catch(error => console.log(error));
        })
        .catch(error => console.log(error));
    } catch (error) {
      console.log(error);
    }
  }  

  useEffect(() => {
    const fetchOrderAndFeedback = async () => {
      try {
        const [orderResponse, feedbackResponse] = await Promise.all([
          axios.get(`http://localhost:3500/order/${orderId}`),
          axios.get(`http://localhost:3500/feedback/${orderId}`)
        ]);

        setOrder(orderResponse.data.order);
        setFeedback(feedbackResponse.data.feedback);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchOrderAndFeedback();
  }, [orderId]);

  function handleCancelOrder() {
    const confirmed = window.confirm("Are you sure you want to cancel the order?");
    
    if (confirmed) {
      const orderCreationTime = new Date(order.date); // Convert order creation time to Date object
      const currentTime = new Date(); // Current time
      
      // Calculate the difference in milliseconds
      const timeDifference = currentTime.getTime() - orderCreationTime.getTime();
      
      // Convert milliseconds to minutes
      const timeDifferenceInMinutes = timeDifference / (1000 * 60);
      
      if (timeDifferenceInMinutes <= 5) {
        // Order can be deleted
        axios.delete(`http://localhost:3500/order/delete/${orderId}`)
          .then(() => {
            alert("Order cancelled successfully.");
            navigate("/order-history");
          })
          .catch(error => {
            console.error("Error cancelling order:", error);
            alert("Error cancelling order");
          });
      } else {
        // Order cannot be deleted after 5 minutes
        alert("Order cannot be cancelled after 5 minutes of creation.");
      }
    } else {
      // User clicked cancel, do nothing
    }
  };
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('feedbackSuccess')) {
      toast.success('Feedback submitted successfully!');
    }

    if (params.get('feedbackUpdateSuccess')) {
      toast.success('Feedback updated successfully!');
    }
  }, [location.search]);

  return (
    <div className="order-info-main">
      <div className="top-bar">
        <div className="container-title-text">Order Details</div>
      </div>
      <ToastContainer />
      {order._id ? (
        <div className="order-info">
          <div className="order-info-container">
            <div className="order-header">
              <div className="order-id">
                <div>Order ID :</div> {order._id}
                <div className="copy-container" onClick={handleCopyClick}>
                  <img src={copyicon} alt="copy"></img>
                  <span className="tooltiptext">{copyOrderId}</span>
                </div>
              </div>
              <div className="date-time">
                <div>{order.date.substring(0, 10)}</div>
                <div>{formatAMPM(order.date)}</div>
              </div>
            </div>
            <div className="order-info-add">
              <div className="meal-name">
                <div>{order.base_name} with {order.portion_name ? order.portion_name.join(", ") : 'No portions selected'}</div>
                <div>({getSizeClass(order.portion_size)})</div>
              </div>
              <div className="qty-row">Quantity : <div>{order.qty}</div></div>
            </div>
            <div className="order-payment-info">
              <div className="order-info-row">
                <div>Total Amount :</div> <div>{order.total_amount}.00 LKR</div>
              </div>
            </div>
          </div>

          <div className="feedback-container">
            {feedback ? (
              <div className="feedback-item">
                <div className="order-info-row">
                  <div className='star-rating'>{starRating(feedback.rating)}</div>
                </div>
                <div className="order-info-row">
                  <div className="comment-container">
                    <div>Comment:</div> <div className="comment-text">{feedback.comment}</div>
                  </div>
                </div>
                <div className="feedback-btns">
                  <div className="delete-feedback-btn" onClick={() => deleteFeedback(feedback._id)}>Delete</div>
                  <div className="update-feedback-btn" onClick={() => navigateToUpdateFeedback(order._id)}>Update</div>
                </div>
              </div>
            ) : (
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
      ) : (
        <div className="order-info-container-info">
          <div className="loading-text">Beep boop boop...</div>
        </div>
      )}
      <div>
        <div type="button" onClick={handleCancelOrder} className="cancel-btn">Cancel Order</div>
      </div>
    </div>
    
  )
}