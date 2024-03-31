import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GetOrder from './components/GetOrder';
import GetOrderInfo from './components/GetOrderInfo'; // Renamed for clarity 
import AddFeedback from './components/AddFeedback';
import UpdateFeedback from './components/UpdateFeedback';

function App() {
  return (
    <Router>
        <Navbar />
      <div className='page-content'>
        <Routes>
          <Route path="/order-history" element={<GetOrder />} />
          <Route path="/order-history/order/:orderId" element={<GetOrderInfo />} />
          <Route path="/order-history/order/:orderId/add-feedback" element={<AddFeedback />} />
          <Route path="/order-history/order/:orderId/update-feedback/:feedbackId" element={<UpdateFeedback />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;