import './App.css';
import AllPayments from './components/allPayments';
import NavBAr from './components/navBar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RefundRequest from './components/reqRefund';
import AllRefunds from './components/refundRequests'
import Checkout from './components/checkout';
import PaymentReport from './components/paymentReport'
import AllBases from './components/AllBases'
import AllPortions from './components/AllPortions'


function App() {
  return (
    <Router>
      <div className="App">
        <NavBAr/>
        
        <Routes>
          <Route exact path="/" element={<AllBases/>}/>
          <Route exact path='/checkout/:baseName/:basePrice/:selectedPortions/:total' element={<Checkout/>}/>
          <Route exact path='/refund' element={<AllRefunds/>}/>
          <Route path="/all-portions/:baseId" element={<AllPortions/>}/>
          <Route exact path='/payments' element={<AllPayments/>}/>
          <Route path='/reqRefun/:orderId' element={<RefundRequest/>}/>
          <Route exact path='/paymentReports' element={<PaymentReport/>}/>
        </Routes>
      </div>
      
    </Router>
  );
}

export default App;

