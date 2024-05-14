import React, {useState}from "react";
import { useNavigate } from "react-router-dom";
import "../css/RegisterForm.css";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function RegisterForm(){

    const [supplier_name, setName] = useState("");
    const [catogory, setCat] = useState("");
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    const [phone_n, setPhone] = useState("");
    const [reg_date, setDate] = useState("");
    const navigate = useNavigate();

    //to submit form
    function sendData(e) {
        e.preventDefault();

        const newSupplier = {
            supplier_name,
            catogory,
            address,
            email,
            phone_n,
            reg_date
        }

        axios.post("http://localhost:3500/supplier/add",newSupplier).then(()=>{
            setName("");
            setCat("");
            setAddress("");
            setEmail("");
            toast.success("New Supplier Added Successfully");
            navigate("/display");// Navigate to the second page

        }).catch((err) =>{
            console.error(err);
            toast.error("New Supplier Can Not Add");
        });

    }

    // Function to get today's date in the format yyyy-mm-dd
    function getTodayDate() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
    const yyyy = today.getFullYear();

    return `${yyyy}-${mm}-${dd}`;
  }

  // validate telephone number
  function handleKeyPress(event) {
    
    const key = event.key;
    const inputValue = event.target.value;

    // Check if the pressed key is a number or a valid character like backspace or delete
    const isValidInput = /^[0-9\b]+$/.test(key);

    const newLength = inputValue.length + 1;

    if (newLength > 10 && key !== '\b') {
        event.preventDefault();
    }

    // If the pressed key is not a number or a valid character, prevent it from being entered into the input field
    if (!isValidInput) {
        event.preventDefault();
    }
    }

    // Handle key down event to restrict input to letters only
    function handleNameKeyDown(event) {
        const key = event.key;
        const isLetter = /^[a-zA-Z\s]*$/.test(key);

        if (!isLetter && key !== 'Backspace' && key !== 'Delete' && key !== 'ArrowLeft' && key !== 'ArrowRight') {
            event.preventDefault();
        }
    }


    return(
        <div className="SR_container">
            
            <form onSubmit={sendData}>
                <h2 className="SR_SupName">Supplier Registration</h2>
                <div className="SR_content">
                    <div className="SR_input-box">
                        <label htmlFor="name">Supplier Name</label>
                        <input type="text" className="SR_input" required
                        onChange={(e)=>{
                            setName(e.target.value);
                        }}
                        onKeyPress={handleNameKeyDown}></input>

                    </div>

                    <div className="SR_input-box">
                        <label htmlFor="catogory">Catogory</label>
                        <div className="SR_selecter" required 
                        onChange={(e)=>{
                            setCat(e.target.value);
                        }}>
                            <select>
                                <option value={""}>Select</option>  
                                <option value={"Vegetables"}>Vegetables</option>
                                <option value={"Fruits"}>Fruits</option>
                                <option value={"Meats"}>Meats</option>
                                <option value={"Sea_Foods"}>Sea Foods</option>
                                <option value={"Spices"}>Spices</option>
                                <option value={"Kitchen_Equipment"}>Kitchen Equipment</option>
                                <option value={"Packing"}>Packing</option>
                            </select>
                        </div>
                    </div>

                    <div className="SR_input-box">
                        <label htmlFor="address">Address </label>
                        <input type="text" className="SR_input" required
                        onChange={(e)=>{
                            setAddress(e.target.value);
                        }}></input>
                    </div>

                    <div className="SR_input-box">
                        <label htmlFor="email">Email</label>
                        <input type="text" className="SR_input" pattern ="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" 
                        title="Please enter a valid email address" required
                        onChange={(e)=>{
                            setEmail(e.target.value);
                        }}></input>
                    </div>

                    <div className="SR_input-box">
                        <label htmlFor="phone">Phone Number</label>
                        <input type="text" className="SR_input" pattern ="0[0-9]{9}" required
                        onChange={(e)=>{
                            setPhone(e.target.value);
                        }}
                        onKeyPress={handleKeyPress}></input>
                    </div>

                    <div className="SR_input-box">
                        <label htmlFor="date">Register Date</label>
                        <input type="date" className="SR_input"required min={getTodayDate()} max={getTodayDate()}
                        onChange={(e)=>{
                            setDate(e.target.value);
                        }}
                        ></input>
                    </div>

                    <div className="SR_button">
                        <button type="submit" className="SR_btn">Register</button>
                    </div>
                </div>
            </form>
            <ToastContainer />
        </div>
    )
}


export default RegisterForm;