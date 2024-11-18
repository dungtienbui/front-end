import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Profile from './components/Profile';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  useEffect(() => {
    setToken(localStorage.getItem('token'));
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/profile" element={token ? <Profile /> : <Login setToken={setToken} />} />
        <Route path="/" element={<Login setToken={setToken} />} />
      </Routes>
    </Router>
  );
}

export default App;
