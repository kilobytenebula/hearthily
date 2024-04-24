import React, {useEffect, useState} from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import '../css/checkout.css';


export default function Checkout(){


    

    //Bank details show and hide implementation
    const [showBankDetails, setShowBankDetails] =useState(false);
    const navigate = useNavigate();

    const handleBTClick=() =>{

        setLastClickedButton('BT');
        setShowBankDetails(true);


    }
    const handleCODClick=() =>{
        setLastClickedButton('COD');

        setShowBankDetails(false);

    }

    //values
    const {baseName, basePrice, selectedPortions, total} = useParams();
    const parsedPortions = JSON.parse(selectedPortions);
    const [finalAmount, setNewTotal] = useState(0);
    const [points, setPoints] = useState([]);
    const [address, setAddress] = useState([]);
    const [inputValue, setInputValue] = useState(0);
    const [lastOrderId, setLastOrderId] = useState('');
    const customerId = "66279ba428c2bd21af0ac912";
    const [lastClickedButton, setLastClickedButton] = useState(null);
    
    //Retrive available loyalty points
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(`http://localhost:3500/points/${customerId}`);
            setPoints(response.data.points);
          } catch (error) {
            console.error('Error fetching loyalty points:', error);
          }
        };
    
        fetchData();
      }, [customerId]);

    // Getting address and phone number from user collection
    useEffect(() => {
        const getAddress = async () => {
            try {
                const response = await axios.get(`http://localhost:3500/user/${customerId}`);
                setAddress(response.data); 
                console.log("dgds" ,response.data.user.address);
                
            } catch (error) {
                console.error('Error fetching address:', error);
            }
        };
    
        getAddress();
    
    }, [customerId]);


    //store input value as a int
    const handleInputChange = (e) => {
        setInputValue(parseInt(e.target.value) || 0);
      };


    //Adding delivery amout to the total
    useEffect(() => {
        setNewTotal(parseFloat(total) + 250);
      }, [total]);


    //Adding loyalty amout enteered by user
    let valueToStore;
    
    const handleApplyClick  = async () => {
        
        if (inputValue <= points) {
         
          valueToStore = parseFloat(inputValue);
          const newTotalAmount = parseFloat(finalAmount) - valueToStore;
          setNewTotal(newTotalAmount);
          setApplied(true);
          console.log('Value to store:', newTotalAmount);



          const loyaltyPointsToAdd = 0.05 * parseFloat(finalAmount);

      // Call API to get current loyalty points
          const newAmount = points - valueToStore;
          try {
            const response = await fetch(`http://localhost:3500/points/update/${customerId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },

                
                body: JSON.stringify({ points: newAmount })
            });
            const pointsResponse = await axios.get(`http://localhost:3500/points/${customerId}`);
            const currentPoints = pointsResponse.data.points;

      // Calculate new loyalty points
         const newPoints = currentPoints + loyaltyPointsToAdd;
            await axios.put(`http://localhost:3500/points/update/${customerId}`, { points: newPoints });

            if (!response.ok) {
                throw new Error('Failed to update points');
            }

            console.log('Points updated successfully');
        } catch (error) {
            console.error('Error updating points:', error);
        }
       
        } else {
          
          valueToStore = 0;
          window.alert('Input value exceeds available points');
          console.log('Value to store:', valueToStore);
        }
      };
      const [applied, setApplied] = useState(false); 
    
      //get order id
      useEffect(() => {
        async function fetchLastOrderId() {
            try {
                const response = await axios.get("http://localhost:3500/order/lastorder/lastid");
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



    const addPayment = async () => {
        const currentDate = new Date().toISOString(); // Get current date in ISO format
    
        // Prepare data to send
        const data = {
          orderId: lastOrderId,
          customerId: customerId,
          amount: finalAmount,
          date: currentDate,
          paymentMethod: lastClickedButton,
        address: address.user.address,
        //   phoneNumber: address.user.phonenumber,
        phoneNumber:"0713456785",
          paymentSlip: { data: image }
           
        };

        try {
            
            const response = await axios.post('http://localhost:3500/payment/add', data);
            console.log(response.data); 
            window.alert('Order Placed successfully!');
            navigate('/payments');
            
          } catch (error) {
            console.error('Error:', error); 
            window.alert('Error occurred while adding payment. Please try again later.');
            
          };
    };

    const [image, setImage] = useState("");
    const handleSubmit = async (event) => {
        event.preventDefault();
        await addPayment();
      };


      function converToBase64(e){
        console.log(e);
        var reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload =() =>{
            console.log(reader.result);
            setImage(reader.result);
        }
      }

      function handleCancelOrder() {
        const confirmed = window.confirm("Are you sure you want to cancel the order?");
        
        if (confirmed) {
            console.log("Button clicked");
            axios.delete(`http://localhost:3500/order/delete/${lastOrderId}`)
                .then(() => {
                    alert("Order cancelled successfully.");
                    setLastOrderId('');
                    navigate("/order");
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

        <div className="paymentContainer">

            <div className="selectedMeal">
                <div className="header">Checkout</div>
                <div className="meal">
                    <div className="itemList">
                        <div className="item">
                            
                            <div className="name">{baseName}</div>
                            <div className="price">{basePrice} LKR</div>

                        </div>
                    </div>
                    <div className="itemList">
                        {parsedPortions.map((portion, index) => (
                        <div className="item" key={index}>
                            <div className="name">{portion.name}</div>
                            <div className="price">{portion.price} LKR</div>
                        </div>
                        ))}
                    </div>
                    <div className="totalPrice">
                        <div className="left">
                            Total
                        </div>
                        <div className="right">
                            {total} LKR

                        </div>

                    </div>
                    <div className="totalPrice">
                        <div className="left">
                            Delivary Fee
                        </div>
                        <div className="right">
                            250 LKR

                        </div>

                    </div>
                    <div className="loyaltyPoints">
                        <div className="left">
                            Loyalty Points
                        </div>
                        <div className="right">
                            <div className="points"><div>Available</div><div>{points}</div></div>
                            <input 
                                type="number" 
                                min="1" 
                                step="1" 
                                onInput={handleInputChange}
                                className="input"
                            />

                            <button className="loyaltyApply" onClick={handleApplyClick} disabled={applied}>Apply</button>


                        </div>

                    </div>
                    <div className="totalPayment">
                        <div className="title">Total Payment</div>
                        <div className="amount">{finalAmount} LKR</div>
                    </div>

                </div>
            </div>
            <div className="checkoutPayment">
                <div className="paymentMethod">
                    <div className="header">
                        Select Payment Method
                    </div>
                    <div className="selectPayment">
                        <button className={`COD ${lastClickedButton === 'COD' ? 'active' : ''}`} onClick={handleCODClick}>Cash On Delivery</button>
                        <button className={`BT ${lastClickedButton === 'BT' ? 'active' : ''}`} onClick={handleBTClick}>Bank Transfer</button>
                    </div>
                    {showBankDetails && <div className="bankDetails">
                        <div className="rows"><div>Bank Of Ceylon</div><div>12345678901234</div></div>
                        <div className="rows"><div>Hatton National Bank</div><div>98765432109876</div></div>
                    </div>}
                    {showBankDetails && <div className="uploadPaymentSlip">Upload Payment Slip</div>}
                    {showBankDetails &&<div className="paymentSlip"><input type="file" accept="image/*" onChange={converToBase64}/>
                    {image && <img src={image} alt="Payment Slip" />}</div>}
                    
                </div>
                <div className="selectAddress">
                    <div className="header">
                        Address
                    </div>
                    <div className="address">
                        
                        <div>{address && address.user && address.user.address}</div>
                        <div>{address && address.user && address.user.phonenumber}</div>
                    </div>
                </div>
                <div className="actions">
                    <button className="cancel" onClick={handleCancelOrder}>Cancel</button>
                    <button className="placeOrder" onClick={handleSubmit}>Place Order</button>
                </div>
            </div>
        </div>

    )
}