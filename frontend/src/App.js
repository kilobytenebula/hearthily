import './App.css';
//import Header from './components/Header';
import Navbar from './components/Navbar';
import AddFeedback from './components/AddFeedback';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GetFeedback from './components/GetFeedback';

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<GetFeedback />} />
          <Route path="/add" element={<AddFeedback />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
