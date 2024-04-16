import './css/App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GetOrder from './components/GetOrder';
import GetOrderInfo from './components/GetOrderInfo';
import AddFeedback from './components/AddFeedback';
import UpdateFeedback from './components/UpdateFeedback';
import GetDelivery from './components/GetDelivery';
import GetDeliveryInfo from './components/GetDeliveryInfo';
import KitchenTest from './components/KitchenTest';
import GetJobHistory from './components/GetJobHistory';
import GetDriver from './components/GetDriver';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/order-history" element={<GetOrder />} />
          <Route path="/order-history/order/:orderId" element={<GetOrderInfo />} />
          <Route path="/order-history/order/:orderId/add-feedback" element={<AddFeedback />} />
          <Route path="/order-history/order/:orderId/update-feedback/:feedbackId" element={<UpdateFeedback />} />
          <Route path="/delivery" element={<GetDelivery />} />
          <Route path="/delivery/job/:deliveryId" element={<GetDeliveryInfo />} />
          <Route path="/dkn" element={<KitchenTest />} />
          <Route path="/job-history" element={<GetJobHistory />} />
          <Route path="/drivers" element={<GetDriver />} />
        </Routes>
    </Router>
  );
}

export default App;