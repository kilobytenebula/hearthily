import './App.css';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import AllBases from './components/AllBases';
import AllPortions from './components/AllPortions';
import Navbar from './components/NavBar';
import Checkout from './components/Checkout';
import GetOrderInfo from './components/GetOrderInfo';
import GetOrder from './components/GetOrder';


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
        </Routes>
      </div>
    </Router>
    
  ); 
}

export default App;
