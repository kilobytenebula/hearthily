import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GetOrder from './components/GetOrder';
import GetOrderInfo from './components/GetOrderInfo'; // Renamed for clarity 
import AddFeedback from './components/AddFeedback';

function App() {
  return (
    <Router>
      <div className='navbar'>
        <Navbar />
      </div>
      <div className='page-content'>
        <Routes>
          <Route path="/order-history" element={<GetOrder />} />
          <Route path="/order-history/order/:orderId" element={<GetOrderInfo />} /> // Adjust component
          <Route path="/order-history/order/:orderId/add-feedback" element={<AddFeedback />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;