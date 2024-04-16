import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../css/GetDelivery.css';

export default function GetDelivery() {
  const [deliveryArray, setDeliveryArray] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [displayData, setDisplayData] = useState([]);

  useEffect(() => {
    // Fetch delivery data
    axios.get('http://localhost:8070/delivery/')
      .then(response => {
        const deliveryData = response.data.filter(delivery => delivery.deliveryStatus === 'of-delivery'); 
        setDeliveryArray(deliveryData);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false)
      });
  }, []);

  useEffect(() => {
    const fetchOrdersAndUsers = async () => {
      const orders = [];
      const users = [];
      const displayData = [];

      for (const deliveryItem of deliveryArray) {
        try {
          // Fetch order data
          const orderResponse = await axios.get(`http://localhost:8070/order/${deliveryItem.orderId}`);
          const orderData = orderResponse.data.order;
          orders.push(orderData);

          // Fetch user data
          const userResponse = await axios.get(`http://localhost:8070/user/${deliveryItem.userId}`);
          const userData = userResponse.data.user;
          users.push(userData);
        } catch (error) {
          console.log(error);
        }

        const correspondingOrder = orders.find(order => order._id === deliveryItem.orderId);
        const correspondingUser = users.find(user => user._id === deliveryItem.userId);

        const deliveryId = deliveryItem._id;
        const name = `${correspondingUser?.firstname} ${correspondingUser?.lastname}`;
        const date = deliveryItem.date ? new Date(deliveryItem.date).toLocaleDateString() : '';
        const location = correspondingUser?.address || '';
        const payment = deliveryItem.paymentMethod;

        displayData.push({
          deliveryId,
          name,
          date,
          location,
          payment
        });
      }
      setDisplayData(displayData);
    };

    if (deliveryArray.length > 0) {
      fetchOrdersAndUsers();
    }

  }, [deliveryArray]);

  return (
    <div className="delivery-container-main">
      <div className="top-bar">
        <div className="container-title-text">Available Jobs</div>
      </div>
      {isLoading ? (
        <div className='loading-deliveries'>Beep boop boop...</div>
      ) : (
        displayData.length > 0 ? (
          <div>
            <div className="fields">
              <ul>
                <li className='name'>Customer Name</li>
                <li className='date'>Date</li>
                <li className='price'>Location</li>
                <li className='payment'>Payment</li>
              </ul>
            </div>
            <div className="delivery-container">
              {displayData.map((item) => (
                <div className="item-delivery" key={item.deliveryId}>
                  <Link to={`/delivery/job/${item.deliveryId}`} className="item-link">
                    <ul>
                      <li className="name">{item.name}</li>
                      <li className="date">{item.date}</li>
                      <li className="price">{item.location}</li>
                      <li className="payment">{item.payment}</li>
                    </ul>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="not-available">No available deliveries. Check back soon!</div>
        )
      )}
    </div>
  );
  
}
