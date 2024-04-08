
import { useParams } from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';
import '../reqRefunds.css';


const ReqRefund = () => {
    const { orderId } = useParams();
    const [mobileNumber,setNumber] =useState("");
    const [reason,setReason] =useState("");
    const [description,setDes] =useState("");
    const customerId = "609c9c918c27e038b0e27b2d";
    const isSuccess = false;

    function sendData(e){
        e.preventDefault();


        const newRefund = {

            customerId,
            mobileNumber,
            orderId,
            reason,
            description,
            isSuccess

        }
        axios.post("http://localhost:8050/refund/add",newRefund).then(()=>{
            alert("Added");
        }).catch((err)=>{
            alert("err");
        })

        console.log(newRefund);
    }

    return (
        <div className="refundContainer">
            <h2>Refund Request</h2>

            <div className='details'>

                <div className='orderDetails'>
                    <div className='idContainer'>
                        <div className='title'>Order ID</div>
                        <div className='id'>{orderId}</div>
                    </div>
                    <div className='timeOrdered'>
                        <div className='title'>Time Ordered</div>
                        <div className='time'>{orderId}</div>
                    </div>
                    <div className='usedMethod'>
                        <div className='title'>Payment Method</div>
                        <div className='method'>{orderId}</div>
                    </div>
                    <div className='paidAmount'>
                        <div className='title'>Paid Amount</div>
                        <div className='method'>{orderId}</div>
                    </div>
                    
                </div>
                <form className="refundForm"
                    onSubmit={sendData}
                
                >
                    <div className="inputField">
                        <label for = "number">Mobile Numeber</label>
                        <input id ="number" className="inputBox" type="tel" 
                        onChange={(e)=>{

                            setNumber(e.target.value);


                        }}

                        ></input>
                    </div>
                    
                    <div className="inputField">
                        <label for="reason">Reason</label>
                        <select  id="reason" name="reason"
                        
                        onChange={(e)=>{

                            setReason(e.target.value);


                        }}
                        >
                            <option value="" disabled selected>Select a reason</option>
                            <option value="wrong_order">Wrong Order</option>
                            <option value="poor_quality">Poor Quality</option>
                            <option value="other">Other</option>
                        </select>

                    </div>
                    
                    <div className="inputField">
                        <label for = "description">Description</label>
                        <textarea   name="message" id="description"
                            onChange={(e)=>{

                                setDes(e.target.value);
        
                            }}
                        
                        ></textarea>
                    </div>
                    <div className="inputField">
                        <input className="submitButton" type="submit" onClick={sendData}/>
                    </div>
                    
                </form>

            </div>

        </div>
    );
};

export default ReqRefund;
