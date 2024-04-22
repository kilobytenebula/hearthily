import './App.css';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import AllBases from './components/AllBases';
import AllPortions from './components/AllPortions';
import Navbar from './components/NavBar';
import Checkout from './components/Checkout';
import GetOrderInfo from './components/GetOrderInfo';
import GetOrder from './components/GetOrder';
import GetInventory from './components/GetInventory';
import UpdateInventory from './components/UpdateInventory';
import OrderHistory from './components/OrderHistory';


function App() {
  return (
    <Router>
      <div className="App">
        <Navbar/>
        <Routes>
          <Route exact path="/" element={<AllBases/>}/>
          <Route path="/all-portions/:baseId" element={<AllPortions/>}/>
          <Route path="/checkout/:baseName/:basePrice/:selectedPortions/:total" element={<Checkout/>}/>
          <Route path="/allBases" element={<AllBases/>}/>
          <Route path="/order-history" element={<GetOrder />} />
          <Route path="/order-history/order/:orderId" element={<GetOrderInfo />} />
          <Route path="/inventory-record" element={<GetInventory/>} />
          <Route path="/inventory-record/inventory/:inventoryId" element={<UpdateInventory/>} />
          <Route path="/admin-panel-order-history" element={<OrderHistory/>} />
        </Routes>
      </div>
    </Router>
    
  ); 
}

export default App;
