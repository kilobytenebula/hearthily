import React, { useState } from "react";
import "../css/InvitationForm.css";
import axios from "axios";

function InvitationForm() {
  const [inviter_name, setIName] = useState("");
  const [email, setIEmail] = useState("");
  const [int_date, setIDate] = useState("");

  // Function to submit invitation form
  function sendIData() {
    const newInviter = {
      inviter_name,
      email,
      int_date,
      status: "Pending"
    };

    axios
      .post("http://localhost:3500/inviter/add", newInviter)
      .then(() => {
        setIName("");
        setIEmail("");
        setIDate("");
        sendEmail(); // Call the sendEmail function
      })
      .catch((err) => {
        console.error(err);
        alert("New Supplier Can Not Add");
      });
  }

  // Function to get today date 
  function getTodayDate() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0"); 
    const yyyy = today.getFullYear();

    return `${yyyy}-${mm}-${dd}`;
  }

  // Function to send email to inviter
  const sendEmail = () => {
    const emailData = {
      email,
      subject: 'Invitation to Joint with us',
      text: 'Please accept this invitation',
      inviter_name
    };

    axios.post('http://localhost:3500/inviter/sending', emailData)
      .then((res) => {
        console.log(res.data); // Log the response from the backend
        alert('Email sent successfully');
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
        alert('Failed to send email');
      });
  };

  return (
    <div className="SIR_container">
      <form onSubmit={(e) => { e.preventDefault(); sendIData(); }}>
        <h2 className="SIR_SupName">Supplier Invitation</h2>
        <div className="SIR_content">
          <div className="SIR_input-box">
            <label htmlFor="name">Inviter Name</label>
            <input
              type="text"
              className="SIR_input"
              required
              value={inviter_name}
              onChange={(e) => {
                setIName(e.target.value);
              }}
            />
          </div>

          <div className="SIR_input-box">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              className="SIR_input"
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              title="Please enter a valid email address"
              required
              value={email}
              onChange={(e) => {
                setIEmail(e.target.value);
              }}
            />
          </div>

          <div className="SIR_input-box">
            <label htmlFor="date">Invited Date</label>
            <input
              type="date"
              className="SIR_input"
              required
              min={getTodayDate()}
              max={getTodayDate()}
              value={int_date}
              onChange={(e) => {
                setIDate(e.target.value);
              }}
            />
          </div>

          <div className="SIR_button">
            <button type="submit" className="SIR_btn"> Send Invitation Email </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default InvitationForm;