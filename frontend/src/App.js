import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import RegisterForm from './components/RegisterForm';
import AllSupplier from "./pages/AllSupplier";
import UpdateSupplier from "./components/UpdateSupplier";
import Dashboard from "./pages/SupplierDashboard";
import SupplierReport from "./components/SupplierReport";
import InvitedSupplier from "./pages/InvitedSupplier";
import AddShipping from "./pages/AddShipping";
import DispalyShipment from "./pages/DisplayShipment";
import SendOrder from "./components/SendOrder";
import UpdateOrder from "./components/UpdateOrder";

function App() {
  return (
    <Router>
      <div>
      <Routes>
        <Route path='/' exact Component={Dashboard} />
        <Route path='/add' exact Component={RegisterForm} />
        <Route path='/display' exact Component={AllSupplier} />
        <Route path='/update/:id' exact Component={UpdateSupplier} />
        <Route path='/display/:id' exact Component={SupplierReport} />
        <Route path='/invite' exact Component={InvitedSupplier} />
        <Route path='/shipment' exact Component={AddShipping} />
        <Route path='/displays' exact Component={DispalyShipment} />
        <Route path='/displays/:id' exact Component={SendOrder} />
        <Route path='/updates/:id' exact Component={UpdateOrder} />
      </Routes>
      </div>
      
    </Router> 
  );
}

export default App;
