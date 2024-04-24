import React, {useState, useEffect} from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import '../css/potions.css'
import { useAuth } from "../Services/Auth/AuthContext";

export default function AllPortions(){
    const [portions, setPortions] = useState([]);
    const {baseId} = useParams();
    const [selectedPortion, setSelectedPortion] = useState([]);
    const [baseDetails, setBaseDetails] = useState({
        base_name: '', 
        reg_price: '' ,
        full_price: ''
    });
    const [loading, setLoading] = useState(true); // Loading state
    const [selectedSizePrice, setSelectedSizePrice] = useState(null);
    const [selctedSize, setSelectedSize] = useState('R');
    let [qty, setQty] = useState(1);
    const [total, setTotal] = useState(baseDetails.reg_price);
    const { userId } = useAuth();
    const status = "pending";
    // const [orderId, setOrderId] = useState('');


    useEffect(()=>{
        
        function getPortions(){
            axios.get("http://localhost:3500/portion/").then((res)=>{
                setPortions(res.data);
            }).catch((err)=>{
                alert(err.message);
            })
        }

        function getBaseDetails() {
            axios.get(`http://localhost:3500/base/`).then((res) => {
                
                const specificBase = res.data.find(base => base._id === baseId);
                if (specificBase) {
                    setBaseDetails(specificBase);
                } else {
                    alert('Base not found');
                }
                setLoading(false); 
            }).catch((err) => {
                alert(err.message);
            });
        }

        getPortions();
        getBaseDetails();
        
    },[baseId]);

    useEffect(() => {
        setTotal(baseDetails.reg_price);
    }, [baseDetails]);

    useEffect(()=>{
        calculateTotal();
    },[selectedPortion,qty,selectedSizePrice]);

    const handleAddPortion = (portionName, portionPrice) => {
        
        setSelectedPortion([...selectedPortion, { name: portionName, price: portionPrice }]);
        
    };

    const handleSizeChange = (price, size) => {
        setSelectedSizePrice(price);
        setSelectedSize(size);
    };

    const handleDiscardPortion = (index) => {
        setSelectedPortion(prevPortions => {
            const updatedPortions = [...prevPortions];
            updatedPortions.splice(index, 1); // Remove the portion at the given index
            return updatedPortions;
        });
    };

    const increment = () =>{
        setQty(++qty);
    }

    const decrement = () =>{
        if(qty > 1){
            setQty(--qty);
        }
    }

    const calculateTotal = () => {
        let basePrice = baseDetails.reg_price;
        basePrice = selctedSize === "F" ? basePrice +  baseDetails.full_price : baseDetails.reg_price;
        let portionTotal = selectedPortion.reduce((acc, curr)=> acc + curr.price, 0);
        let totalPrice = (basePrice * qty) +  portionTotal;
        setTotal(totalPrice);
    };

    function addOrder(){
        const portionNames = selectedPortion.map(portion => portion.name);
        
        const newOrder = {
            customerId: userId,
            base_name: baseDetails.base_name,
            portion_name: portionNames,
            portion_size: selctedSize,
            qty: qty,
            total_amount: total,
            status: status
        };
        axios.post("http://localhost:3500/order/add",newOrder).then(()=>{
            alert("Order Added")
        }).catch((err)=>{
            alert(err)
        })
    }


    return(
        <div className="container">

            <div className="content">
            <div className="header">Decorate with curries</div>
            <div className="potion-list">
                {portions.map((portion)=>(
                    <div key={portion._id} className="potion-item">
                        <div className="potion-item-name">{portion.portion_name}</div>
                       <div className="portion-bottom-part">
                        <div className="portion-price"><div>Price</div><div>{portion.price} LKR </div></div>
                        <button className="portion-add-button" onClick={()=>handleAddPortion(portion.portion_name, portion.price)}>Add</button>
                        </div>
                    </div>
                ))}
            </div>

            </div>
            
            <div className="mealbar">
                <div className="side-heading">Main Dish</div>
                <div className="side-container">
                    <div className="side-itme">Item</div>
                    <div className="side-item">Price</div>
                </div>
                
                <div className="side-container">
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <>
                            <div>{baseDetails.base_name}</div> 
                            <div>{baseDetails.reg_price}LKR</div>
                        </>
                    )}
                </div>
                <div className="side-container side-container-qty">
                    <div className="side-item">Qty</div>
                    <div className="side-item">
                        <button className="plus" onClick={()=>increment()}>+</button>
                        {qty}
                        <button className="minus" onClick={()=>decrement()}>-</button>
                    </div>
                </div>
                
                <div className="side-heading">Choice of size</div>
                <div className="side-container">
                    <div className="side-item radio" >
                        <input type="radio" name="portion-size" id="regular" onChange={()=>handleSizeChange(baseDetails.reg_price,'R')}  checked = {selctedSize =='R'}></input>
                        <label name="portion-size">Regular</label>
                    </div>
                </div>
                <div className="side-container">
                    <div className="side-item radio">
                        <input type="radio" name="portion-size" id="full" onChange={()=>handleSizeChange(baseDetails.full_price,'F')}></input>
                        <label name="portion-size">Full</label>
                    </div>
                    <div className="side-item">
                        +{baseDetails.full_price}LKR
                    </div>
                </div>
                <div className="side-heading curry-pairings">Curry Pairings</div>
                <div className="side-container">
                    <div className="side-itme">Item</div>
                    <div className="side-item">Price</div>
                </div>
               
                    <div className="selected-portions-container">
                        {selectedPortion.map((portion, index) => (
                            <div key={index} className="selected-portions">
                                <div className="side-item"><button onClick={()=>handleDiscardPortion(index)}>-</button></div>
                                <div className="side-item">{portion.name}</div>
                                <div className="side-item">{portion.price}LKR</div>
                            </div>
                        ))}
                    </div>
                    <div className="side-container">
                        <div className="side-item">Total</div>
                        <div>{total}LKR</div>
                    </div>
                    <div className="button-container">
                        <div></div>
                        <div className="">
                           <Link   
                             to={`/checkout/${baseDetails.base_name}/${selectedSizePrice}/${JSON.stringify(selectedPortion)}/${total}`}>  
                             <button type="button" onClick={addOrder}>Checkout</button>
                           </Link>   
                            
                        </div>
                    </div>
                
                
            </div>
        </div>
    )
}
