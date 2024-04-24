import React, {useState}from "react";
import "../css/RegisterForm.css";
import axios from "axios";


function RegisterForm(){

    const [supplier_name, setName] = useState("");
    const [catogory, setCat] = useState("");
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    const [phone_n, setPhone] = useState("");
    const [reg_date, setDate] = useState("");

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
            alert("New Supplier Added Successfully");
            window.location.href = "/display";// Navigate to the second page

        }).catch((err) =>{
            console.error(err);
            alert("New Supplier Can Not Add");
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
                        }}></input>

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
                                <option value={"Sea Foods"}>Sea Foods</option>
                                <option value={"Spices"}>Spices</option>
                                <option value={"Kitchen Equipment"}>Kitchen Equipment</option>
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
                        }}></input>
                    </div>

                    <div className="SR_input-box">
                        <label htmlFor="date">Register Date</label>
                        <input type="date" className="SR_input"required min={getTodayDate()} max={getTodayDate()}
                        onChange={(e)=>{
                            setDate(e.target.value);
                        }}></input>
                    </div>

                    <div className="SR_button">
                        <button type="submit" className="SR_btn">Register</button>
                    </div>
                </div>
            </form>
        </div>
    )
}


export default RegisterForm;