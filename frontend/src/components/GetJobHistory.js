import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../css/GetDelivery.css';

export default function GetJobHistory() {
  const [jobsArray, setJobsArray] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [acceptedDeliveries, setAcceptedDeliveries] = useState([]);
  const [completedDeliveries, setCompletedDeliveries] = useState([]);

  useEffect(() => {
    // Fetch delivery data
    axios.get('http://localhost:8070/delivery/')
      .then(response => {
        const jobs = response.data.filter(delivery => delivery.deliveryStatus === 'on-delivery' || delivery.deliveryStatus === 'completed');
        setJobsArray(jobs);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    const fetchOrdersAndUsers = async () => {
      const orders = [];
      const users = [];
      const accepted = [];
      const completed = [];

      for (const jobItem of jobsArray) {
        try {
          // Fetch order data
          const orderResponse = await axios.get(`http://localhost:8070/order/${jobItem.orderId}`);
          const orderData = orderResponse.data.order;
          orders.push(orderData);

          // Fetch user data
          const userResponse = await axios.get(`http://localhost:8070/user/${jobItem.userId}`);
          const userData = userResponse.data.user;
          users.push(userData);
        } catch (error) {
          console.log(error);
        }

        const correspondingOrder = orders.find(order => order._id === jobItem.orderId);
        const correspondingUser = users.find(user => user._id === jobItem.userId);

        const deliveryId = jobItem._id;
        const name = `${correspondingUser?.firstname} ${correspondingUser?.lastname}`;
        const date = correspondingOrder?.date ? new Date(correspondingOrder.date).toLocaleDateString() : '';
        const location = correspondingUser?.address || '';
        const payment = jobItem.paymentMethod;

        if (jobItem.deliveryStatus === 'on-delivery') {
          accepted.push({
            deliveryId,
            name,
            date,
            location,
            payment
          });
        } else if (jobItem.deliveryStatus === 'completed') {
          completed.push({
            deliveryId,
            name,
            date,
            location,
            payment
          });
        }
      }
      setAcceptedDeliveries(accepted);
      setCompletedDeliveries(completed);
    };

    if (jobsArray.length > 0) {
      fetchOrdersAndUsers();
    }

  }, [jobsArray]);

  return (
    <div>
      <div className="top-bar">
        <div className="container-title-text">Job History</div>
      </div>
      {isLoading ? (
        <div className="loading-deliveries">Beep boop boop...</div>
      ) : (
        <div className="job-container">
          <div className="accepted-deliveries-container">
            <div className="top-bar">
              <div className="job-container-title-text">Accepted Jobs</div>
            </div>
            {acceptedDeliveries.length > 0 ? (
              <div>
                <div className="fields">
                  <ul>
                    <li className="name">Customer Name</li>
                    <li className="date">Date</li>
                    <li className="price">Location</li>
                    <li className="payment">Payment</li>
                  </ul>
                </div>
                <div className="delivery-container">
                  {acceptedDeliveries.map((accepted) => (
                    <div className="item-delivery" key={accepted.deliveryId}>
                      <Link to={`/delivery/job/${accepted.deliveryId}`} className="item-link">
                        <ul>
                          <li className="name">{accepted.name}</li>
                          <li className="date">{accepted.date}</li>
                          <li className="price">{accepted.location}</li>
                          <li className="payment">{accepted.payment}</li>
                        </ul>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="not-available">No accepted deliveries yet.</div>
            )}
          </div>
  
          <div className="completed-deliveries-container">
            <div className="top-bar">
              <div className="job-container-title-text">Completed Jobs</div>
            </div>
            {completedDeliveries.length > 0 ? (
              <div>
                <div className="fields">
                  <ul>
                    <li className="name">Customer Name</li>
                    <li className="date">Date</li>
                    <li className="price">Location</li>
                    <li className="payment">Payment</li>
                  </ul>
                </div>
                <div className="delivery-container">
                  {completedDeliveries.map((completed) => (
                    <div className="item-delivery" key={completed.deliveryId}>
                      <Link to={`/delivery/job/${completed.deliveryId}`} className="item-link">
                        <ul>
                          <li className="name">{completed.name}</li>
                          <li className="date">{completed.date}</li>
                          <li className="price">{completed.location}</li>
                          <li className="payment">{completed.payment}</li>
                        </ul>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="not-available">No completed deliveries yet.</div>
            )}
          </div>
        </div>
      )}
      </div>
  );
  
}
