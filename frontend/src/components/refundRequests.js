import React, { useState, useEffect } from "react";
import {Link, useParams} from 'react-router-dom'
import axios from "axios";


export default function RefundRequest(){

    const [refunds, setPayments] = useState([]);

    useEffect(()=>{

        function getRefunds(){
            axios.get(`http://localhost:8050/refund`)
                .then((res) => {
                    console.log(res.data);
                    setPayments(res.data);
                })
                .catch((err) => {
                    alert(err.message);
                });
        }
        getRefunds();
    },[])
}