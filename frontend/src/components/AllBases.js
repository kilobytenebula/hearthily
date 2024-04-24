import React, {useState, useEffect} from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import '../css/allBases.css'


export default function AllBases(){
    const [bases, setBases] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("Sri Lankan Dishes");
    const [records, setRecords] = useState([]);
    const [riceBases, setRiceBases] = useState([]);
    const [otherBases, setOtherBases] = useState([]);
    const [filteredBases, setFilteredBases] = useState([]);
    const [defaultBases, setDefaultBases] = useState([]);

    useEffect(()=>{
        function getBases(){
            axios.get("http://localhost:3500/base/").then((res)=>{
                setBases(res.data);
                setRecords(res.data);
                setDefaultBases(res.data.filter(base => base.category === selectedCategory));
                setRiceBases(res.data.filter(base => base.category === selectedCategory && base.base_type === "Rice"));
                setOtherBases(res.data.filter(base => base.category === selectedCategory && base.base_type === "Others"));
                setFilteredBases(res.data.filter(base => base.category === selectedCategory));
                //console.log(res.data);
            }).catch((err)=>{
                alert(err.message);
            })
        }
        getBases();
    },[selectedCategory])

    const Filter =(event) =>{
        const searchValue = event.target.value.toLowerCase();
        if (searchValue === "") {
            setRecords(defaultBases);
            setRiceBases(defaultBases.filter(base => base.base_type === "Rice"));
            setOtherBases(defaultBases.filter(base => base.base_type === "Others"));
            setFilteredBases(defaultBases);
        } else {
            const filteredRecords = defaultBases.filter(f => 
                f.base_name.toLowerCase().includes(searchValue)
            );
            setRecords(filteredRecords);
            setRiceBases(filteredRecords.filter(base => base.base_type === "Rice"));
            setOtherBases(filteredRecords.filter(base => base.base_type === "Others"));
            setFilteredBases(filteredRecords);
        }
    }

    return(
        <div className="container1">
            <div className="headerContainer">
                <div className="head-and-search">
                <div className="allbases-heading">What are you craving today?</div>
                <div className="search-container">
                    <input type="text" className="search" placeholder='Search..' onChange={Filter} />
                </div>
                </div>
                <ul>
                    <li onClick={()=> setSelectedCategory("Sri Lankan Dishes")} className={selectedCategory === "Sri Lankan Dishes" ? "selected" : ""}>Sri Lankan Dishes</li>
                    <li onClick={()=> setSelectedCategory("Bakery Items")} className={selectedCategory === "Bakery Items" ? "selected" : ""}>Bakery Items</li>
                    <li onClick={()=> setSelectedCategory("Beverages")} className={selectedCategory === "Beverages" ? "selected" : ""}>Beverages</li>
                </ul>
            </div>
            
            {selectedCategory === "Sri Lankan Dishes" && (
                <div>
                    <div className="base-category">Rice</div> 
                    <div className="bases-list">
                        {riceBases.map((base) => (
                            <div key={base._id} className="base_item">
                                <div className="base-name">{base.base_name}</div>
                                <div className="base-bottom">
                                <div className="base-reg-price"><div>Reg price</div><div>{base.reg_price} LKR</div></div>
                                <div className="base-full-price"><div>Full price</div><div> {base.full_price} LKR</div></div>
                                <Link className="base-action" to={`/all-portions/${base._id}`}>Select</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="base-category">Others</div>
                    <div className="bases-list">
                        {otherBases.map((base) => (
                            <div key={base._id} className="base_item">
                            <div className="base-name">{base.base_name}</div>
                            <div className="base-bottom">
                            <div className="base-reg-price"><div>Reg price</div><div>{base.reg_price} LKR</div></div>
                            <div className="base-full-price"><div>Full price</div><div> {base.full_price} LKR</div></div>
                            <Link className="base-action" to={`/all-portions/${base._id}`}>Select</Link>
                            </div>
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

