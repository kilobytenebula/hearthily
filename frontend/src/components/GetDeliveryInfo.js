import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import '../GetDeliveryInfo.css';

export default function GetDeliveryInfo() {
    const [delivery, setDelivery] = useState({});
    const [order, setOrder] = useState({});
    const [user, setUser] = useState({});
    const { deliveryId } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [displayData, setDisplayData] = useState([]);
  
    useEffect(() => {
        axios.get(`http://localhost:8070/delivery/${deliveryId}`)
            .then(response => {
                const deliveryData = response.data.delivery;
                setDelivery(deliveryData);
                setIsLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setIsLoading(false)
            });
    }, []);
  
    useEffect(() => {
        const fetchOrdersAndUsers = async () => {
            axios.get(`http://localhost:8070/order/${delivery.orderId}`)
            .then(response => {
                const orderData = response.data.order;
                setOrder(orderData);
                console.log(orderData)
            })
            .catch((error) => {
                console.log(error);
            });

            axios.get(`http://localhost:8070/user/${delivery.userId}`)
            .then(response => {
                const userData = response.data.user;
                setUser(userData);
                console.log(userData);
            })
            .catch((error) => {
                console.log(error);
            });
        }
    }, [delivery]);


return (
    <div>
        <div className="top-bar">
            <div className="container-title-text">Delivery Details</div>
        </div>
        {delivery._id ? (
            <div className="delivery-info">
                <div className="delivery-info-container">
                    <div className="delivery-header">
                        <div className="delivery-id">
                            <div className="delivery-id-text">Delivery ID:</div>
                            <div className="delivery-id-value">{delivery._id}</div>
                        </div>
                        <div className="delivery-status">
                            <div className="delivery-status-text">Status:</div>
                            <div className="delivery-status-value">{delivery.deliveryStatus}</div>
                        </div>
                    </div>
                    <div className="delivery-body">
                        <div className="delivery-order-id">
                            <div className="delivery-order-id-text">Order ID:</div>
                            <div className="delivery-order-id-value">{delivery.orderId}</div>
                        </div>
                        <div className="delivery-user-id">
                            <div className="delivery-user-id-text">User ID:</div>
                            <div className="delivery-user-id-value">{delivery.userId}</div>
                        </div>
                    </div>
                </div>
            </div>
        ) : (
            <div className="order-info-container-info">
                <div className="loading-text">Beep boop boop...</div>
            </div>
        )}
    </div>
);
}