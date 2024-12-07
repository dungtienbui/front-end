import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Profile from './components/Profile';
import ClinicsManagement from './components/clinic/ClinicsManagement';
import ClinicDetail from './components/clinic/ClinicDetail';
import DoctorManagement from './components/doctor/DoctorManagement';
import DoctorDetail from './components/doctor/DoctorDetail';
import Navbar from './components/Navbar';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    setToken(localStorage.getItem('token'));
  }, []);

  return (
    <Router>
      <Navbar token={token} setToken={setToken} />
      <Routes>
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/profile" element={token ? <Profile /> : <Login setToken={setToken} />} />
        {/* Clinic Routes */}
        <Route path="/clinics" element={token ? <ClinicsManagement /> : <Login setToken={setToken} />} />
        <Route path="/clinics/:id" element={token ? <ClinicDetail /> : <Login setToken={setToken} />} />
        {/* Doctor Routes */}
        <Route path="/doctors" element={token ? <DoctorManagement /> : <Login setToken={setToken} />} />
        <Route path="/doctors/:id" element={token ? <DoctorDetail /> : <Login setToken={setToken} />} />
        <Route path="/" element={<Login setToken={setToken} />} />
      </Routes>
    </Router>
  );
}

export default App;
