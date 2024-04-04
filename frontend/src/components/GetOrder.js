import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../css/GetOrder.css';

export default function GetOrder() {
  const [order, setOrder] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  function getStatusClass(status) {
    const statusMap = {
      pending: 'Pending',
      completed: 'Completed',
      preparing: 'Preparing',
      cancelled: 'Cancelled'
    };

    return statusMap[status] || '';
  }

  useEffect(() => {
    const fetchOrder = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('http://localhost:8070/order/');
        setOrder(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        // Consider setting an error state variable to display an error message
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, []);

  return (
    <div className="order-history">
      <div className="top-bar">
        <div className="container-title-text">Order History</div>
        <div className="search-container"></div>
      </div>
      {isLoading ? (
        <div className='loading-orders'>Beep boop boop...</div>
      ) : (
        <div>
          <div className="fields">
            <ul>
              <li className='meal'>Meals</li>
              <li className='date'>Date</li>
              <li className='price'>Price</li>
              <li className='status'>Status</li>
            </ul>
          </div>
          <div className="order-container">
            {order.length > 0 ? (
              order.map((orderItem) => (
                <div className="item" key={orderItem._id}>
                  <Link to={`/order-history/order/${orderItem._id}`} className="item">
                    <ul>
                      <li className="meal">{orderItem.base_name} with {orderItem.portion_name.join(', ')}</li>
                      <li className="date">{orderItem.date.substring(0, 10)}</li>
                      <li className="price">{orderItem.total_amount}.00 LKR</li>
                      <li className="status">
                        <div className={`status-dyn ${orderItem.status}`}>
                          {getStatusClass(orderItem.status)}
                        </div>
                      </li>
                    </ul>
                  </Link>
                </div>
              ))
            ) : (
              <div>No orders found.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
