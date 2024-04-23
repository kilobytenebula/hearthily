import React, { useState, useEffect } from "react";
import "../css/InvitationTable.css";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import axios from "axios";// to get data from database
import Search from "../components/Search";
import InvitationForm from "./InvitationForm";


function InvitationTable(){

    const [inviters, setInviters] = useState ([]);

    //display invited suppliers in page
    useEffect(() => {
        function getInviter() {
            axios.get("http://localhost:3500/inviter/invite").then((res) => {
                const inviters = res.data.map((inviter) => ({
                    ...inviter,
                    int_date: new Date(inviter.int_date).toLocaleDateString(),
                }));
                setInviters(inviters); // Set the state with the fetched data
            }).catch((err) => {
                alert(err.message);
            })
        }
        getInviter();
    }, []); 

    //delete inviter
    const deleteInviter = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this Inviter?");
        if (confirmDelete) {
          try {
            await axios.delete(`http://localhost:3500/inviter/delete/${id}`);
            setInviters((prevSuppliers) =>
              prevSuppliers.filter((supplier) => supplier._id !== id)
            );
            //alert(" Inviter deleted successfully");
          } catch (error) {
            console.error("Error deleting Inviter:", error);
            alert("Error deleting Inviter");
          }
        }
      }


    return(
        <div>
            <Search />
            <InvitationForm/>
        <div className="SI_details">
            <div className="SI_supplier">
                <div class="SI_cardHeader">
                    <span className="SI_cardName">Supplier List</span>
                </div>
    
                <table>
                    <thead>
                        <tr>
                            <td>ID</td>
                            <td>Inviter Name</td>
                            <td>Email</td>
                            <td>Invited Date</td>
                            <td>status</td>
                            <td>Action</td>
                        </tr>
                    </thead>
    
                    <tbody>
                        
                        {inviters.map((inviter, index) => (
                            <tr key={inviter._id}>
                                <td>{index+1}</td>
                                <td>{inviter.inviter_name}</td>
                                <td>{inviter.email}</td>
                                <td>{inviter.int_date}</td>
                                <td>
                                    <span className={inviter.status === 'Pending' ? 'pending' : ''}>{inviter.status}
                                    </span>
                                </td>
                                <td> 
                                    <botton id = "SI_update-icon"><AiFillEdit/></botton>
                                    <botton onClick={() => deleteInviter(inviter._id)}><AiFillDelete id ="S_delete-icon"/></botton>
                                    
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
export default InvitationTable;