import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// We will create these components next
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AddItem from './pages/AddItem.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import Checkout from './pages/Checkout.jsx';
import Orders from './pages/Orders.jsx';
import Chat from './pages/Chat.jsx';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow bg-gray-50">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-item" element={<AddItem />} />
            <Route path="/edit-item/:id" element={<AddItem />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/checkout/:id" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
