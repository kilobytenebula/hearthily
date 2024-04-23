import React, {useState, useEffect} from "react";
import "../css/SupplierTable.css";
import { AiFillDelete, AiFillEdit, AiOutlineDownload } from "react-icons/ai";
import axios from "axios";// to get data from database
import { Link } from "react-router-dom";
import Search from "../components/Search";


function SupplierTable(){

    const [suppliers, setSuppliers] = useState([]);//dispaly suppliers
    const [searchQuery, setSearchQuery] = useState(""); // State for search query
    
    //dispaly suppliers
    useEffect(() => {
        function getSuppliers(){
           axios.get("http://localhost:3500/supplier/display").then((res) => {
                const formattedSuppliers = res.data.map((supplier) => ({
                ...supplier,
                reg_date: new Date(supplier.reg_date).toLocaleDateString(),// Extracting only the date part from the reg_date field
            }));
            setSuppliers(formattedSuppliers);
           }).catch((err) =>{
                alert(err.message);
           })
        }
        getSuppliers();
    },[])

    //search supplier
    const filteredSuppliers = suppliers.filter(supplier =>
        supplier.supplier_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplier.catogory.toLowerCase().includes(searchQuery.toLowerCase())
    );

    //delete supplier
    const deleteSupplier = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this supplier?");
        if (confirmDelete) {
          try {
            await axios.delete(`http://localhost:3500/supplier/delete/${id}`);
            setSuppliers((prevSuppliers) =>
              prevSuppliers.filter((supplier) => supplier._id !== id)
            );
            alert("Supplier deleted successfully");
          } catch (error) {
            console.error("Error deleting supplier:", error);
            alert("Error deleting supplier");
          }
        }
      }

    

    return(
        <div>
            <Search setSearchQuery={setSearchQuery}/>
        <div className="S_details">
            <div className="S_supplier">
                <div class="S_cardHeader">
                    <span className="S_cardName">Supplier List</span>
                    <Link to ="/add" className="S_cardbtn">Add Supplier</Link>
                </div>
    
                <table>
                    <thead>
                        <tr>
                            <td>ID</td>
                            <td>Supplier Name</td>
                            <td>Catogory</td>
                            <td>Address</td>
                            <td>Email</td>
                            <td>Phone Number</td>
                            <td>Register Date</td>
                            <td>Action</td>
                        </tr>
                    </thead>
    
                    <tbody>
                        {filteredSuppliers.map((supplier, index) => (
                            <tr key={supplier._id}>
                                <td>{index+1}</td>
                                <td>{supplier.supplier_name}</td>
                                <td>{supplier.catogory}</td>
                                <td>{supplier.address}</td>
                                <td>{supplier.email}</td>
                                <td>{supplier.phone_n}</td>
                                <td>{supplier.reg_date}</td>
                                <td>
                                    <Link to={`/update/${supplier._id}`}><AiFillEdit id ="S_update-icon"/></Link>
                                    <botton onClick={() => deleteSupplier(supplier._id)}><AiFillDelete id ="S_delete-icon"/></botton>
                                    <Link to={`/display/${supplier._id}`}><AiOutlineDownload id ="S_down-icon"/></Link>
                                </td>
                            </tr>
                        ))}     
                    </tbody>
                </table>
            </div>
        </div>

        </div>
    )
}

export default SupplierTable;