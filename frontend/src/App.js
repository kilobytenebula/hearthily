import './css/App.css';
import './css/sort.css';
import AllPayments from './components/allPayments';
import NavBAr from './components/navBar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './Services/Auth/AuthContext';
import RefundRequest from './components/reqRefund';
import AllRefunds from './components/refundRequests'
import Checkout from './components/checkout';
import PaymentReport from './components/paymentReport'
import AllBases from './components/AllBases'
import AllPortions from './components/AllPortions'
import RequestedRefunds from './components/requestedRefunds'
import GetOrder from './components/GetOrder';
import GetOrderInfo from './components/GetOrderInfo';
import AddFeedback from './components/AddFeedback';
import UpdateFeedback from './components/UpdateFeedback';
import GetDelivery from './components/GetDelivery';
import GetDeliveryInfo from './components/GetDeliveryInfo';
import KitchenTest from './components/KitchenTest';
import GetJobHistory from './components/GetJobHistory';
import GetDriver from './components/GetDriver';
import GetDriverInfo from './components/GetDriverInfo';
import JobSummary from './components/JobSummary';
import Main from './Pages/Main'
import { ToastContainer } from 'react-toastify'
import Login from './Pages/Login/Login'
import Register from './Pages/Register/Register'
import UserStack from './Pages/UserStack/UserStack'
import NotFound from './Pages/NotFound/NotFound'
import NotAuthorized from './Pages/NotAuthorized/NotAuthorized'
import EmpProfile from './Pages/UserStack/EmpProfile/EmpProfile'
import Home from './Pages/UserStack/Home/Home'
import ForgotPassword from './Pages/ForgotPassword/ForgotPassword'
import ChangePassword from './Pages/ForgotPassword/ChangePassword'
import ResetByEmail from './Pages/ForgotPassword/ResetByEmail'
import RegisterForm from './components/RegisterForm';
import AllSupplier from "./components/AllSupplier";
import UpdateSupplier from "./components/UpdateSupplier";
import SupplierReport from "./components/SupplierReport";
import InvitedSupplier from "./components/InvitedSupplier";
import AddShipping from "./components/AddShipping";
import DispalyShipment from "./components/DisplayShipment";
import SendOrder from "./components/SendOrder";
import UpdateOrder from "./components/UpdateOrder";
import GetInventory from './components/GetInventory';
import UpdateInventory from './components/UpdateInventory';
import OrderHistory from './components/OrderHistory';
import ShipmentReport from './components/ShipmentReport';

function App() {
  return (
    <Router>
      <div className="App">
        <AuthProvider>
        <NavBAr/>
        <ToastContainer />
        <Routes>
          {/* rash */}
          <Route exact path="/order" element={<AllBases/>}/>
          <Route exact path='/checkout/:baseName/:basePrice/:selectedPortions/:total' element={<Checkout/>}/>
          <Route exact path='/refunds' element={<AllRefunds/>}/>
          <Route path="/all-portions/:baseId" element={<AllPortions/>}/>
          <Route exact path='/payments' element={<AllPayments/>}/>
          <Route path='/reqRefun/:orderId' element={<RefundRequest/>}/>
          <Route exact path='/paymentReports' element={<PaymentReport/>}/>
          <Route exact path='/requestedRefunds' element={<RequestedRefunds/>}/>

          {/* sav */}
          <Route path="/order-history" element={<GetOrder />} />
          <Route path="/order-history/order/:orderId" element={<GetOrderInfo />} />
          <Route path="/order-history/order/:orderId/add-feedback" element={<AddFeedback />} />
          <Route path="/order-history/order/:orderId/update-feedback/:feedbackId" element={<UpdateFeedback />} />
          <Route path="/delivery" element={<GetDelivery />} />
          <Route path="/delivery/job/:deliveryId" element={<GetDeliveryInfo />} />
          <Route path="/dkn" element={<KitchenTest />} />
          <Route path="/job-history" element={<GetJobHistory />} />
          <Route path="/drivers" element={<GetDriver />} />
          <Route path="/driver/:driverId" element={<GetDriverInfo />} />
          <Route path="/job-summary" element={<JobSummary />} />

          {/* ash */}
          <Route path='/' element={<Login />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/forgotPassword' element={<ForgotPassword />} />
          <Route path='/changePassword' element={<ChangePassword />} />
          <Route path='/resetPassword' element={<ResetByEmail />} />
          <Route path='/main' element={<Main />} >
            <Route index element={ <UserStack />} />
            <Route path='user' element={<UserStack />} >
              <Route index element={<Home/>}/>
              <Route path='home' element={<Home/>}/>
              <Route path='empEdit' element={<EmpProfile/>}/>
            </Route>
          </Route>
          <Route path='/notallowed' element={<NotAuthorized />} />
          <Route path='*' element={<NotFound />} />

          {/* osh */}
          <Route path='/add' exact Component={RegisterForm} />
          <Route path='/display' exact Component={AllSupplier} />
          <Route path='/update/:id' exact Component={UpdateSupplier} />
          <Route path='/display/:id' exact Component={SupplierReport} />
          <Route path='/invite' exact Component={InvitedSupplier} />
          <Route path='/shipment' exact Component={AddShipping} />
          <Route path='/displays' exact Component={DispalyShipment} />
          <Route path='/displays/:id' exact Component={SendOrder} />
          <Route path='/updates/:id' exact Component={UpdateOrder} />
          <Route path='/shipment-report' exact Component={ShipmentReport} />
            
          {/* thej */}
          <Route path="/inventory-record" element={<GetInventory/>} />
          <Route path="/inventory-record/inventory/:inventoryId" element={<UpdateInventory/>} />
          <Route path="/admin-panel-order-history" element={<OrderHistory/>} />
          </Routes>
        </AuthProvider>
      </div>
    </Router>
  );
}

export default App;
