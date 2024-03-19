import React, { userState, useEffect, useState } from 'react';
import axios from 'axios';
import '../getFeedback.css';

function GetFeedback() {

    const [feedback, setFeedback] = useState([]);

    useEffect(() => {
        function fetchFeedback() {
            axios.get('http://localhost:8070/feedback/')
                .then(res => setFeedback(res.data))
                .catch(error => console.log(error));
        }
        fetchFeedback();
    }, []);

    return (
        <div className="order-history">
            <div className="top-bar">
                <div className="container-title-text">Order History</div>
                <div className="search-container"></div>
            </div>
                <div className="fields">
                    <ul>
                        <li>Meals</li>
                        <li>Date</li>
                        <li>Price</li>
                        <li>Status</li>
                    </ul>
                </div>
                <div className='feedback-container'>
                    {feedback.map((item, index) => (
                        <div key={index} className='feedback-item'>
                            <p>Rating: {item.rating}</p>
                            <p>Comment: {item.comment}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
}

export default GetFeedback;