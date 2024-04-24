import React, {useState, useEffect}from "react";
import "../css/OrderForm.css";
import axios from "axios";

function OrderForm(){

  const [supplier_name, setName] = useState("");
  const [catogory, setCat] = useState("");
  const [email, setEmail] = useState("");
  const [order_list, setOrder] = useState(null);
  const [ship_date, setDate] = useState("");
  const [suppliers, setSuppliers] = useState([]);

  // Function to fetch supplier details based on category
  useEffect(() => {
    if (catogory) {
      axios
        .get(`http://localhost:3500/supplier/display?category=${catogory}`)
        .then((res) => {
          setSuppliers(res.data);
        })
        .catch((err) => {
          console.error(err);
          alert("Failed to fetch supplier details");
        });
    }
  }, [catogory]);

  const handleCategoryChange = (e) => {
    setCat(e.target.value);
  };

  // Function to handle supplier selection
  const handleSupplierChange = (e) => {
    const selectedSupplier = suppliers.find(
      (supplier) => supplier.supplier_name === e.target.value
    );
    if (selectedSupplier) {
      setEmail(selectedSupplier.email);
      setName(selectedSupplier.supplier_name);
    }
  };


  // Function to get today date
  function getTodayDate() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
    const yyyy = today.getFullYear();

    return `${yyyy}-${mm}-${dd}`;
  }

  // Function to handle form submission
  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const formData = new FormData();
    formData.append("file", order_list); // Append the file object, not just its name

    const formattedDate = new Date(ship_date).toISOString();

    const newShipment = {
      supplier_name,
      catogory, 
      email,
      ship_date: formattedDate,
      status: "pending"
    };

    // Combine form data and shipment data
    for (let key in newShipment) {
      formData.append(key, newShipment[key]);
    }

    await axios.post("http://localhost:3500/shipment/ship", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    alert("Shipment added successfully");
    window.location.href = "/displays";
  } catch (error) {
    console.error(error);
    alert("Failed to add shipment");
  }};

  return(
    <div className="SO_container"> 
      <form onSubmit={handleSubmit}>
        <h2 className="SO_SupName">Shipping</h2>
        <div className="SO_content">
          <div className="SO_input-box">
            <label htmlFor="name">Supplier Name</label>
            <div className="SO_selecter" >
              <select className="SO_input"
                value={supplier_name}
                onChange={handleSupplierChange} >
                  <option value="">Select Supplier</option>
                    {suppliers.map((supplier) => (
                    <option key={supplier._id} value={supplier.supplier_name}>
                    {supplier.supplier_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="SO_input-box">
            <label htmlFor="catogory">Category</label>
              <div className="SO_selecter" >
                <select value={catogory} onChange={handleCategoryChange}>
                  <option value="">Select</option>
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

          <div className="SO_input-box">
            <label htmlFor="email">Email</label>
            <input type="text" className="SO_input" pattern ="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" 
              title="Please enter a valid email address"
              value={email}
              onChange={(e)=>{
                setEmail(e.target.value);
              }}>
            </input>
          </div>

          <div className="SO_input-box">
            <label htmlFor="order">Order List</label>
            <input type="file" accept="application/pdf" className="SO_input" required
              onChange={(e)=>{
                setOrder(e.target.files[0]);
              }}>
            </input>
          </div>

          <div className="SO_input-box">
            <label htmlFor="date">Order Date</label>
            <input type="date" className="SO_input"required 
              min={getTodayDate()} 
              max={getTodayDate()}
              value={ship_date}
              onChange={(e)=>{
                setDate(e.target.value);
              }}>
            </input>
          </div>

          <div className="SO_button">
            <button type="submit" className="SO_btn">Order</button>
          </div>
        </div>
      </form>
    </div>
  )
}


export default OrderForm;