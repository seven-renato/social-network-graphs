import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { useSelector } from 'react-redux';

import Login from './pages/Login';
import Home from "./pages/Home";
import Register from "./pages/Register";
import GraphComponent from './pages/components/GraphComponent';

function App() {
  const user = useSelector((state) => state.user.currentUser);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/home" element={<>{user ? <Home /> : <Login />}</>} />
        <Route path="/perfil/:username" element={<Home />} />
        
        <Route path="*" element={<Navigate to="/login" />} />
        
        <Route path="/social-network" element={<GraphComponent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
