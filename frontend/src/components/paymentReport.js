import React, { useState } from "react";
import '../paymentReports.css';

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



    return(


        <div className="paymentReportContainer">
            <div className="header">Revenue Reports</div>
            <div className="totalOverview">
                
                <div className="totalRevenue">
                    <div className="totRevenue">
                        <div className="title">Total Order Revenue</div>
                        <div className="amount">25000.00LKR</div>
                    </div>
                    <div className="refund">
                        <div className="title">Refunded Order Amount</div>
                        <div className="amount">200.00LKR </div>
                    </div>
                    <div className="afterRefund">
                        <div className="title">Balance After refund</div>
                        <div className="amount">24500.00LKR</div>
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
                    <div>12000.00LKR</div>

                </div>}
                {showBTOverview && <div className="btOverview">
                    <div>Total Bank Transfer Amount</div>
                    <div>12000.00LKR</div>    
                </div>}
                
            </div>
            <div className="lists">
                <div className="searchBar"><input
                        type="search"
                        placeholder="Search..."
                    />
                    <button type="submit">Search</button>
                 </div>
                {showCODList && <div className="codList">
                    <div className="listHeader">
                        <div>Order Id</div>
                        <div>Date</div>
                        <div>Amount</div>
                    </div>
                    <div className="list">
                        <div className="listItem">
                            <div>Order Id</div>
                            <div>Date</div>
                            <div>Amount</div>
                        </div>
                    </div>   
                </div>}
                {showBTList && <div className="btList">
                    <div className="listHeader">
                        <div>Order Id</div>
                        <div>Date</div>
                        <div>Amount</div>
                    </div>
                    <div className="list">
                        <div className="listItem">
                            <div>Order Id</div>
                            <div>Date</div>
                            <div>Amount</div>
                        </div>
                    </div> 
                </div>}
            </div>
        </div>
    )

}