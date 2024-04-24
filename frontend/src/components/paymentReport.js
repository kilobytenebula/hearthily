import React, { useEffect, useState } from "react";
import axios from "axios";
import '../css/paymentReports.css';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';

const download = require('../icons/download.png')

export default function PaymentReports(){

    const [showBTOverview, setShowBTOverview] = useState(false); // State to manage BT overview visibility
    const [showBTList, setShowBTList] = useState(false);
    const [showCODOverview, setShowCODOverview] = useState(true);
    const [showCODList, setShowCODList] = useState(true);

    const handleBankTransferClick = () => {
        setShowBTOverview(true);
        setShowBTList(true);
        setShowCODOverview(false);
        setShowCODList(false);
    };
    const handleCodClick = ()=>{
        setShowBTOverview(false);
        setShowBTList(false);
        setShowCODOverview(true);
        setShowCODList(true);
    }

    //Retrieving all payments

    const [allPayments, setAllPayments] = useState([]);

    useEffect(()=>{

        function getAllPayments(){
            axios.get("http://localhost:3500/payment/")
            .then((res)=>{
                setAllPayments(res.data);
            }).catch((err)=>{
                alert(err.message);
            }) 
        }
        getAllPayments();


    }, []);


    const totalAmount = allPayments.reduce((accumulator, payment) => accumulator + parseFloat(payment.amount), 0).toFixed(2);

    //Retrieving all refunds

    const [allRefunds, setAllRefunds] = useState([]);
    

    useEffect(()=>{

        function getAllRefunds(){
            axios.get("http://localhost:3500/refund/")
            .then((res)=>{
                setAllRefunds(res.data);
            }).catch((err)=>{
                alert(err.message);
            }) 
        }
        getAllRefunds();


    }, [])

    const successfulRefunds = allRefunds.filter(refund => refund.isSuccess === "accepted");





    const successfulRefundOrderIds = successfulRefunds.map(refund => refund.orderId);


    const successfulRefundPayments = allPayments.filter(payment => successfulRefundOrderIds.includes(payment.orderId));

    const totalSuccessfulRefundAmount = successfulRefundPayments.reduce((accumulator, payment) => accumulator + parseFloat(payment.amount), 0).toFixed(2);

    const Balance = (totalAmount - totalSuccessfulRefundAmount).toFixed(2);


    const codPayments = allPayments.filter(payment => payment.paymentMethod === 'COD');
    const btPayments = allPayments.filter(payment => payment.paymentMethod === 'BT');

    // Calculate total amount for COD payments
    const totalCodAmount = codPayments.reduce((accumulator, payment) => accumulator + parseFloat(payment.amount), 0).toFixed(2);
    // Calculate total amount for BT payments
    const totalBtAmount = btPayments.reduce((accumulator, payment) => accumulator + parseFloat(payment.amount), 0).toFixed(2);


    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchCodResults, setSearchCodResults] = useState([])

    const handleSearch = () => {
        if (searchQuery.trim() === '') {
            // If the search query is empty, reset searchResults to all bank transfer payments
            setSearchResults([]);
        } else {
            // Otherwise, filter bank transfer payments based on the search query
            const results = btPayments.filter(payment => payment.orderId.includes(searchQuery));
            setSearchResults(results);
        }
        if (searchQuery.trim() === '') {
            // If the search query is empty, reset searchCodResults to all COD payments
            setSearchCodResults([]);
        } else {
            // Otherwise, filter COD payments based on the search query
            const codResults = codPayments.filter(payment => payment.orderId.includes(searchQuery));
            setSearchCodResults(codResults);
        }
    };
    const updatePayment = async (orderId, isSuccess) => {
        try {
            const response = await axios.put(`http://localhost:3500/payment/update/${orderId}`, { isSuccess });
            console.log(response.data); // Log the response from the API
        } catch (error) {
            console.error('Error updating payment:', error);
        }
    };
    const handleUpdatePayment = (orderId, isSuccess) => {
        updatePayment(orderId, isSuccess);
     
    };
    
    const handleDownloadClick = (imageURL) => {
        const downloadLink = document.createElement('a');
        downloadLink.href = imageURL;
        downloadLink.download = 'payment_slip.png'; // Set a default filename for the downloaded image
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      };

      function getDateOnly(datetimeString) {
        return datetimeString.split("T")[0];
    }
      function generateCSVData(codPayments, btPayments) {
        const csvData = [
            ["Bank Transfer Payments"],
            ["Customer ID", "Order ID", "Amount", "Date"],
            ...btPayments.map(payment => [payment.customerId, payment.orderId, payment.amount, getDateOnly(payment.date)]),
            [],
            ["Cash on Delivery Payments"],
            ["Customer ID", "Order ID", "Amount", "Date"],
            ...codPayments.map(payment => [payment.customerId, payment.orderId, payment.amount,getDateOnly(payment.date)])
        ];
        return csvData;
    }

    function generatePDFAndDownload(codPayments, btPayments) {
        const doc = new jsPDF();
        
        doc.setFontSize(12);
        let yPos = 20;
    
        doc.text(20, yPos, "Bank Transfer Payments");
        btPayments.forEach(payment => {
            yPos += 10;
            doc.text(20, yPos, `${payment.customerId}       ${payment.orderId}       ${payment.amount}       ${getDateOnly(payment.date)}`);
        });
    
        yPos += 20;
        doc.text(20, yPos, "Cash on Delivery Payments");
        codPayments.forEach(payment => {
            yPos += 10;
            doc.text(20, yPos, `${payment.customerId}       ${payment.orderId}       ${payment.amount}       ${getDateOnly(payment.date)}`);
        });
        doc.save('report.pdf');
    }
    

    const [selectedOption, setSelectedOption] = useState(null);

    const [isReversed, setIsReversed] = useState(false);

    const reverseList = () => {
        setIsReversed(!isReversed);
    };
    
    return(


        <div className="paymentReportContainer">
            <div className="paymentReportHeader">Revenue Reports
                <div className="reports">
                <select className="chooseReport" onChange={(e) => setSelectedOption(e.target.value)}>
                    <option value="">Get Reports</option>
                    <option value="csv">CSV</option>
                    <option value="pdf">PDF</option>
                </select>
                {selectedOption === "csv" && (
                    <CSVLink className="csvButton" data={generateCSVData(codPayments, btPayments)} filename={"report.csv"}>
                        Download CSV
                    </CSVLink>
                )}
                {selectedOption === "pdf" && (
                    <button 
                    onClick={() => generatePDFAndDownload(codPayments, btPayments)}
                     className="pdfButton">
                        Download PDF
                    </button>
                )}
                </div>
                
            </div>
            
            <div className="totalOverview">
            <div>
            
        </div>
                <div className="totalRevenue">
                    <div className="totRevenue">
                        <div className="title">Total Order Revenue</div>
                        <div className="amount">{totalAmount} LKR</div>
                    </div>
                    <div className="refund">
                        <div className="title">Refunded Order Amount</div>
                        <div className="amount">{totalSuccessfulRefundAmount} LKR </div>
                    </div>
                    <div className="afterRefund">
                        <div className="title">Balance After refund</div>
                        <div className="amount">{Balance} LKR</div>
                    </div>
                </div>
            </div>
            <div className="navigations">
                <button className={`navButton ${showCODOverview ? 'clicked' : ''}`} onClick={handleCodClick}>Cash On Delivery</button>
                <button className={`navButton ${showBTOverview ? 'clicked' : ''}`} onClick={handleBankTransferClick}>Banck Transfers</button>
            </div>
            <div className="overview">
                {showCODOverview && <div className="codOverview">
                    <div>Total Cash On Delivery Amount</div>
                    <div>{totalCodAmount} LKR</div>

                </div>}
                {showBTOverview && <div className="btOverview">
                    <div>Total Bank Transfer Amount</div>
                    <div>{totalBtAmount} LKR</div>    
                </div>}
                
            </div>
            <div className="lists">
                {showBTOverview && (
                    <div className="searchBarBT">
                    <input 
                        type="search" 
                        placeholder="Search by Order Id..." 
                        value={searchQuery} 
                        onChange={e => {
                            setSearchQuery(e.target.value);
                            // handleSearch(); // Call handleSearch function on input change
                        }} 
                    />
                    <button onClick={handleSearch}>Search</button>
                </div>
                    )}
                    {showCODOverview && (
                    <div className="searchBarCOD">
                        <input
                        type="search" 
                        placeholder="Search by Order Id..." 
                        value={searchQuery} 
                        onChange={e => {
                            setSearchQuery(e.target.value);
                            // handleSearch(); // Call handleSearch function on input change
                        }} />
                        <button onClick={handleSearch}>Search</button>
                    </div>
                    )}
                {showCODList && <div className="codList">
                    <div className="listHeader">
                        <div className="id">Order Id</div>
                        <div className="date">Date</div>
                        <div className="amount">Amount</div>
                        <div className="status">Status</div>
                        <div className="actions"></div>
                    </div>
                    {searchCodResults.length === 0 && (
                    <div className="list">
                        {codPayments.reverse().map((payment, index) => (
                            <div className="listItem" key={index}>
                            <div className="id">{payment.orderId}</div>
                            <div className="date">{payment.date.substring(0, 10)}</div>
                            <div className="amount">{parseFloat(payment.amount).toFixed(2)} LKR</div>
                            <div className="status">

                                {payment.isSuccess === "pending" && <div className="pending">Pending</div>}
                                 {payment.isSuccess === "approved" && <div className="approved">Approved</div>}
                                {payment.isSuccess === "rejected" && <div className="rejected">Rejected</div>}


                            </div>
                             <div className="actions">
                                {payment.isSuccess === "pending" && ( // Only render buttons if isSuccess is "Pending"
                                    <>
                                        <button className="approve" onClick={() => handleUpdatePayment(payment.orderId, "approved")}>Approve</button>
                                        <button className="reject" onClick={() => handleUpdatePayment(payment.orderId, "rejected")}>Reject</button>
                                    </>
                                )}
                             </div>
                            </div>
                        ))}
                        </div>   
                        )}
                        <div className="list">
                            {searchCodResults !== null && ( // Only render the list if searchResults is not null
                                (searchCodResults).reverse().map((payment, index) => (
                                    <div className="listItem" key={index}>
                                        <div className="id">{payment.orderId}</div>
                                        <div className="date">{payment.date.substring(0, 10)}</div>
                                        <div className="amount">{parseFloat(payment.amount).toFixed(2)} LKR</div>
                                        <div className="status">
                                            
                                             {payment.isSuccess === "pending" && <div className="pending">Pending</div>}
                                            {payment.isSuccess === "approved" && <div className="approved">Approved</div>}
                                            {payment.isSuccess === "rejected" && <div className="rejected">Rejected</div>}
                                        </div>
                                         <div className="actions">
                                         {payment.isSuccess === "pending" && ( // Only render buttons if isSuccess is "Pending"
                                                <>
                                                    <button className="approve" onClick={() => handleUpdatePayment(payment.orderId, "approved")}>Approve</button>
                                                    <button className="reject" onClick={() => handleUpdatePayment(payment.orderId, "rejected")}>Reject</button>
                                                </>
                                            )}
                                            
                                         </div>
                                    </div>
                                ))
                            )}
                        </div>
                        
                </div>}
                {showBTList && <div className="btList">
                    <div className="listHeader">
                        <div className="id">Order Id</div>
                        <div className="date">Date</div>
                        <div className="amount">Amount</div>
                        <div className="status">Status</div>
                        <div className="slip">Slip</div>
                        <div className="actions"></div>
                    </div>
                    <div>
                        {searchResults.length === 0 && (
                            <div className="list">
                                {btPayments.reverse().map((payment, index) => (
                                    <div className="listItem" key={index}>
                                        <div className="id">{payment.orderId}</div>
                                        <div className="date">{payment.date.substring(0, 10)}</div>
                                        <div className="amount">{parseFloat(payment.amount).toFixed(2)} LKR</div>
                                        
                                        <div className="status">

                                            {payment.isSuccess === "pending" && <div className="pending">Pending</div>}
                                            {payment.isSuccess === "approved" && <div className="approved">Approved</div>}
                                            {payment.isSuccess === "rejected" && <div className="rejected">Rejected</div>}
                                        </div>
                                        {payment.paymentSlip && ( // Check if paymentSlip exists
                                            <div className="slip">
                                            <i className="your-icon-class" onClick={() => handleDownloadClick(payment.paymentSlip.data)}>
                                                
                                                <img src={download} alt="Download Icon" />
                                            </i>
                                            </div>
                                        )}
                                        <div className="actions">

                                            {payment.isSuccess === "pending" && ( // Only render buttons if isSuccess is "Pending"
                                                <>
                                                    <button className="approve" onClick={() => handleUpdatePayment(payment.orderId, "approved")}>Approve</button>
                                                    <button className="reject" onClick={() => handleUpdatePayment(payment.orderId, "rejected")}>Reject</button>
                                                </>
                                            )}
                                            

                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="list">
                            {searchResults !== null && ( // Only render the list if searchResults is not null
                                (searchResults).reverse().map((payment, index) => (
                                    <div className="listItem" key={index}>
                                        <div className="id">{payment.orderId}</div>
                                        <div className="date">{payment.date.substring(0, 10)}</div>
                                        <div className="amount">{parseFloat(payment.amount).toFixed(2)} LKR</div>
                                        <div className="status">
                                            {payment.isSuccess === "pending" && <div className="pending">Pending</div>}
                                            {payment.isSuccess === "approved" && <div className="approved">Approved</div>}
                                            {payment.isSuccess === "rejected" && <div className="rejected">Rejected</div>}
                                        </div>
                                        {payment.paymentSlip && ( // Check if paymentSlip exists
                                            <div className="slip">
                                            <button onClick={() => handleDownloadClick(payment.paymentSlip.data)}>Download</button>
                                            </div>
                                        )}
                                        <div className="actions">
                                        {payment.isSuccess === "pending" && ( // Only render buttons if isSuccess is "Pending"
                                                <>
                                                    <button className="approve" onClick={() => handleUpdatePayment(payment.orderId, "approved")}>Approve</button>
                                                    <button className="reject" onClick={() => handleUpdatePayment(payment.orderId, "rejected")}>Reject</button>
                                                </>
                                            )}
                                            
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>}
            </div>
        </div>
    )

}