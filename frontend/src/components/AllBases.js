import React, {useState, useEffect} from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import '../allBases.css'



export default function AllBases(){
    const [bases, setBases] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("Sri Lankan Dishes");

    useEffect(()=>{
        function getBases(){
            axios.get("http://localhost:8070/base/").then((res)=>{
                setBases(res.data);
                //console.log(res.data);
            }).catch((err)=>{
                alert(err.message);
            })
        }
        getBases();
    },[])

    const filteredBases = bases.filter(
        (base) => base.category === selectedCategory
    );

    const riceBases = selectedCategory === "Sri Lankan Dishes" ? filteredBases.filter((base) => base.base_type === "Rice") : [];
    const otherBases = selectedCategory === "Sri Lankan Dishes" ? filteredBases.filter((base) => base.base_type === "Others") : filteredBases;

    return(
        <div className="container1">
            <div className="headerContainer">
             <div className="heading">What are you craving today?</div>
             <ul>
                <li onClick={()=> setSelectedCategory("Sri Lankan Dishes")}>Sri Lankan Dishes</li>
                <li onClick={()=> setSelectedCategory("Bakery Items")}>Bakery Items</li>
                <li onClick={()=> setSelectedCategory("Beverages")}>Beverages</li>
             </ul>
            </div>
            
            {/* <div className="base-category">Rice</div>  */}
            
            {selectedCategory === "Sri Lankan Dishes" && (
              <div>
                <div className="base-category">Rice</div> 
                <div className="bases-list">
                    {riceBases.map((base) => (
                    <div key={base._id} className="base_item">
                        <h2>{base.base_name}</h2>
                        <p>Reg price: {base.reg_price}LKR</p>
                        <p>Full price: {base.full_price}LKR</p>
                        <Link to={`/all-portions/${base._id}`}>Portions</Link>
                    </div>
                    ))}
                </div>
                <div className="base-category">Others</div>
                <div className="bases-list">
                    {otherBases.map((base) => (
                    <div key={base._id} className="base_item">
                        <h2>{base.base_name}</h2>
                        <p>Reg price: {base.reg_price}LKR</p>
                        <p>Full price: {base.full_price}LKR</p>
                        <Link to={`/all-portions/${base._id}`}>Portions</Link>
                    </div>
                    ))}
                </div>
              </div>
            )}

            {selectedCategory !== "Sri Lankan Dishes" && (
              <div className="bases-list">
                {filteredBases.map((base) => (
                    <div key={base._id} className="base_item">
                        <h2>{base.base_name}</h2>
                        <p>Reg price: {base.reg_price}LKR</p>
                        <p>Full price: {base.full_price}LKR</p>
                        <Link to={`/all-portions/${base._id}`}>Portions</Link>
                    </div>
                ))}
              </div>
            )}

            


        </div>
    )
}