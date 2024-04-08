import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import axios from "axios";


export default function Checkout(){
    const {baseName, basePrice, selectedPortions, total, orderId} = useParams();
    const parsedPortions = JSON.parse(selectedPortions);
    const [lastOrderId, setLastOrderId] = useState('');

    useEffect(() => {
        async function fetchLastOrderId() {
            try {
                const response = await axios.get("http://localhost:8070/order/lastorder/lastid");
                if (response.data && response.data.orderId) {
                    setLastOrderId(response.data.orderId);
                    console.log("orderId:",response.data.orderId )
                } else {
                    console.error("Invalid response format:", response);
                    alert("Error: Invalid response format");
                }
            } catch (error) {
                console.error("Error fetching last order ID:", error);
                alert("Error fetching last order ID");
            }
            
        }
        
        fetchLastOrderId();
        
    }, []);

    function handleCancelOrder() {
        const confirmed = window.confirm("Are you sure you want to cancel the order?");
        
        if (confirmed) {
            console.log("Button clicked");
            axios.delete(`http://localhost:8070/order/delete/${lastOrderId}`)
                .then(() => {
                    alert("Order cancelled successfully.");
                    setLastOrderId('');
                    window.location.href = "/allBases";
                })
                .catch(error => {
                    console.error("Error cancelling order:", error);
                    alert("Error cancelling order");
                });
        } else {
            // User clicked cancel, do nothing
        }
    };
    


    return(
        <div className="container">
            <div className="content">
                <h4>Main Dish: {baseName} </h4>
                <h4>Price: {basePrice} </h4>
                <h4>Portions: </h4>
                <ul>
                    {parsedPortions.map((portion, index) => (
                    <li key={index}>
                        <p>Name: {portion.name}</p>
                        <p>Price: {portion.price}</p>
                    </li>
                    ))}
                </ul>
                <h4>Total: {total}</h4>
                <h4>order ID: {lastOrderId}</h4>
                <button type="button" onClick={handleCancelOrder}>Cancel Order</button>
            </div>
        </div>
    )
}