import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './login/login.jsx';
import Register from './register/register.jsx';
import Inventory from './inventory/inventory.jsx';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/inventory" element={<Inventory />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
