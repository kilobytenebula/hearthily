import './App.css';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import AllBases from './components/AllBases';
import AllPortions from './components/AllPortions';
import Navbar from './components/NavBar';
import Checkout from './components/Checkout';


function App() {
  return (
    <Router>
      <div className="App">
        <Navbar/>
        <Routes>
          <Route exact path="/" element={<AllBases/>}/>
          <Route path="/all-portions/:baseId" element={<AllPortions/>}/>
          <Route path="/checkout" element={<Checkout/>}/>
        </Routes>
      </div>
    </Router>
    
  ); 
}

export default App;
