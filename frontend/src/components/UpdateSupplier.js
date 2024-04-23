import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function UpdateSupplier() {
    const { id } = useParams()
    const [supplier_name, setName] = useState("");
    const [catogory, setCat] = useState("");
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    const [phone_n, setPhone] = useState("");
    const [reg_date, setDate] = useState("");

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(`http://localhost:3500/supplier/display/${id}`);
      const supplier = response.data.supplier;

      setName(supplier.supplier_name);
      setCat(supplier.catogory);
      setAddress(supplier.address);
      setEmail(supplier.email);
      setPhone(supplier.phone_n);
      const formattedDate = new Date(supplier.reg_date).toISOString().split('T')[0];
      setDate(formattedDate);
    }
    fetchData();
  }, [id]);

  const updateSupplier = async (e) => {
    e.preventDefault();

    const updatedSupplier = {
      supplier_name,
      catogory,
      address,
      email,
      phone_n,
      reg_date,
    };

    await axios.put(`http://localhost:3500/supplier/update/${id}`, updatedSupplier).then(()=>{
        setName("");
        setCat("");
        setAddress("");
        setEmail("");
        setPhone("");
        setDate("");
        alert("Supplier Updated Successfully");
        window.location.href = "/display";// Navigate to the second page
        
    }).catch((err) =>{
        console.error(err);
        alert("Supplier Can Not Update");
    });

   


  };

  return (
    <div className="SR_container">
      <form onSubmit={updateSupplier}>
        <h2 className="SR_SupName">Update Supplier</h2>
        <div className="SR_content">
          <div className="SR_input-box">
            <label htmlFor="name">Supplier Name</label>
            <input
              type="text"
              className="SR_input"
              required
              value={supplier_name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            ></input>
          </div>

          <div className="SR_input-box">
            <label htmlFor="catogory">Category</label>
            <div className="SR_selecter" required>
              <select
                value={catogory}
                onChange={(e) => {
                  setCat(e.target.value);
                }}
              >
                <option value="">select</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Fruits">Fruits</option>
                <option value="Meats">Meats</option>
                <option value="Sea Foods">Sea Foods</option>
                <option value="Spices">Spices</option>
                <option value="Kitchen Equipment">Kitchen Equipment</option>
                <option value="Packing">Packing</option>
              </select>
            </div>
          </div>

          <div className="SR_input-box">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              className="SR_input"
              required
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
              }}
            ></input>
          </div>

          <div className="SR_input-box">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              className="SR_input"
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              title="Please enter a valid email address"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            ></input>
          </div>

          <div className="SR_input-box">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="text"
              className="SR_input"
              pattern="0[0-9]{9}"
              required
              value={phone_n}
              onChange={(e) => {
                setPhone(e.target.value);
              }}
            ></input>
          </div>

          <div className="SR_input-box">
            <label htmlFor="date">Register Date</label>
            <input
              type="date"
              className="SR_input"
              required
              value={reg_date}
              onChange={(e) => {
                setDate(e.target.value);
              }}
            ></input>
          </div>

          <div className="SR_button">
            <button type="submit" className="SR_btn">
              Update
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default UpdateSupplier;