import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import RegisterForm from './components/RegisterForm';
import AllSupplier from "./pages/AllSupplier";
import UpdateSupplier from "./components/UpdateSupplier";
import Dashboard from "./pages/SupplierDashboard";

function App() {
  return (
    <Router>
      <div>
      <Routes>
        <Route path='/' exact Component={Dashboard} />
        <Route path='/add' exact Component={RegisterForm} />
        <Route path='/display' exact Component={AllSupplier} />
        <Route path='/update/:id' exact Component={UpdateSupplier} />
      </Routes>
      </div>
      
    </Router> 
  );
}

export default App;
