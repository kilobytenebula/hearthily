import React, {useState, useEffect} from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import '../allBases.css'


export default function AllBases(){
    const [bases, setBases] = useState([]);
    //const [selectedBaseName, setSelectedBaseName] = useState(" ");


    useEffect(()=>{
        function getBases(){
            axios.get("http://localhost:8050/base/").then((res)=>{
                setBases(res.data);
                //console.log(res.data);
            }).catch((err)=>{
                alert(err.message);
            })
        }
        getBases();
    },[])

    return(
        <div className="container1">
            <div className="headerContainer">
             <div className="heading">What are you craving today?</div>
             <ul>
                <li>Sri Lankan Dishes</li>
                <li>Bakery Items</li>
                <li>Beverages</li>
             </ul>
            </div>
            
            <div className="bases-list">
                {bases.map((base)=>(
                    <div key={base._id} className="base_item">
                        <h2>{base.base_name}</h2>
                        
                        <p>Reg price: {base.reg_price}LKR</p>
                        <p>Full price: {base.full_price}LKR</p>
                        <Link
                            to={`/all-portions/${base._id}`}
                            //onClick={() => setSelectedBaseName(base.base_name)} // Set the selected baseId
                        > Portions
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    )
}