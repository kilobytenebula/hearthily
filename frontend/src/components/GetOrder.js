import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../css/GetOrder.css';
import searchIcon from '../icons/search.png';
import { useAuth } from '../Services/Auth/AuthContext';
import DocumentTitle from './DocumentTitle';

export default function GetOrder() {
  const [order, setOrder] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [records, setRecords] = useState([]);
  const { userId } = useAuth();

  DocumentTitle("My Orders");

  function getStatusClass(status) {
    const statusMap = {
      pending: 'Pending',
      completed: 'Completed',
      preparing: 'Preparing',
      cancelled: 'Cancelled',
      'on-delivery': 'On Your Way',
      'of-delivery': 'Ready for Delivery'
    };

    return statusMap[status] || '';
  }

  useEffect(() => {
    const fetchOrder = async () => {
      setIsLoading(true);
      try {
        console.log("ID", userId);
        const response = await axios.get(`http://localhost:3500/order/customer/${userId}`);
        setOrder(response.data.orders);
        setRecords(response.data.orders);
        console.log("Orders",response.data.orders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        // Consider setting an error state variable to display an error message
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, []);

  const Filter =(event) =>{
    setRecords(order.filter(f => 
      f.base_name.toLowerCase().includes(event.target.value) ||
      f.portion_name.some(portion => portion.toLowerCase().includes(event.target.value)) ||
      f.total_amount.toString().includes(event.target.value) ||
      f.status.toString().includes(event.target.value)
    ));
  }

  return (
    <div className="order-history">
      <div className="top-bar">
        <div className="container-title-text">Order History</div>
        <div className="search-container">
        <div className="search-icon">
            <img src={searchIcon} alt="search" />
          </div>
          <input type="text" className="search" placeholder='Search by meal, amount, or status' onChange={Filter} />
        </div>
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
            {records.length > 0 ? (
              records.map((orderItem) => (
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
              <div className="not-available">No available orders. :(</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
