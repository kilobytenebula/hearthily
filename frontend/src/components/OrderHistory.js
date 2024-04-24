import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {CSVLink} from 'react-csv';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import '../css/OrderHistory.css';
const arrow = require('../icons/sort-arrow.png');


export default function GetOrder() {
  const [order, setOrder] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [records, setRecords] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

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
        const response = await axios.get('http://localhost:3500/order/');
        setOrder(response.data);
        setRecords(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
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
      f._id.toLowerCase().includes(event.target.value) ||
      f.status.toLowerCase().includes(event.target.value)
    ));
  }

  const sortData = (key) => {
    let sortedRecords = [...records];
    if (sortBy === key) {
      sortedRecords.reverse();
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      sortedRecords.sort((a, b) => {
        if (a[key] < b[key]) return sortOrder === 'asc' ? -1 : 1;
        if (a[key] > b[key]) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
      setSortBy(key);
      setSortOrder('asc');
    }
    setRecords(sortedRecords);
  };

  const exportToCSV = () => {
    const csvData = order.map(orderItem => ({
      'Order ID': orderItem._id,
      'Meals': `${orderItem.base_name} with ${orderItem.portion_name.join(', ')}`,
      'Date': orderItem.date.substring(0, 10),
      'Qty': orderItem.qty,
      'Portion Size': orderItem.portion_size,
      'Price': `${orderItem.total_amount}.00 LKR`,
      'Status': getStatusClass(orderItem.status)
    }));
  
    return csvData;
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Order ID', 'Meals', 'Date', 'Qty', 'Portion Size', 'Price', 'Status']],
      body: order.map(orderItem => [
        orderItem._id,
        `${orderItem.base_name} with ${orderItem.portion_name.join(', ')}`,
        orderItem.date.substring(0, 10),
        orderItem.qty,
        orderItem.portion_size,
        `${orderItem.total_amount}.00 LKR`,
        getStatusClass(orderItem.status)
      ])
    });
    doc.save('order_history.pdf');
  };

  return (
    <div className='inventory-main'>
    <div className="orderHistory">
      <div className="topBar">
        <div className='orderHistoryTitle'>
          <div className='title'>Order History</div>
          {/* <div className="search-container"> */}
            <input type="text" className="search" placeholder='Search..' onChange={Filter} />
          {/* </div> */}
        </div>
        
        <div className='report-container'>
            <select className="chooseReport" onChange={(e) => setSelectedOption(e.target.value)}>
                <option value="">Get Reports</option>
                <option value="csv">CSV</option>
                <option value="pdf">PDF</option>
            </select>
                {selectedOption === "csv" && (
                    <CSVLink className="csvButton" data={exportToCSV()} filename={"order_history.csv"}>
                        Download CSV
                    </CSVLink>
                )}
                {selectedOption === "pdf" && (
                    <button 
                    onClick={() => exportToPDF()}
                     className="pdfButton">
                        Download PDF
                    </button>
                )}
        </div>
      </div>
      {isLoading ? (
        <div className='loading-orders'>Beep boop boop...</div>
      ) : (
        <div className='historyTable'>
          <div className="tableTitles">
            <ul>
              <li className='orderId'>Order ID</li> 
              <li className='mealName'>Meals</li>
              <li className='orderDate'>Date <img src={arrow} alt="sorting arrow" className='sort-arrow' onClick={() => sortData('date')}/></li>
              <li className='qt'>Qty</li>
              <li className='portionSize'>Portion Size</li>
              <li className='totalPrice'>Price <img src={arrow} alt="sorting arrow" className='sort-arrow' onClick={() => sortData('date')}/></li>
              <li className='orderStatus'>Status</li>
            </ul>
          </div>
          <div className="orderDetails">
            {order.length > 0 ? (
              records.map((orderItem) => (
                <div className="orderItems" key={orderItem._id}>
                    <ul>
                      <li className="orderId">{orderItem._id}</li>
                      <li className="mealName">{orderItem.base_name} with {orderItem.portion_name.join(', ')}</li>
                      <li className="orderDate">{orderItem.date.substring(0, 10)}</li>
                      <li className="qt">{orderItem.qty}</li>
                      <li className="portionSize">{orderItem.portion_size}</li>
                      <li className="totalPrice">{orderItem.total_amount}.00 LKR</li>
                      <li className="orderStatus">
                        <div className={`status-dyn ${orderItem.status}`}>
                          {getStatusClass(orderItem.status)}
                        </div>
                      </li>
                    </ul>
                </div>
              ))
            ) : (
              <div>No orders found.</div>
            )}
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
