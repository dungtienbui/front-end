import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ token, setToken }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/login');
  };

  return (
    <nav style={styles.navbar}>
      <ul style={styles.navList}>
        <li style={styles.navItem}>
          <Link to="/profile" style={styles.link}>Profile</Link>
        </li>
        <li style={styles.navItem}>
          <Link to="/clinics" style={styles.link}>Clinics Management</Link>
        </li>
        <li style={styles.navItem}>
          <Link to="/doctors" style={styles.link}>Doctors Management</Link>
        </li>
        {token ? (
          <li style={styles.navItem}>
            <button onClick={handleLogout} style={styles.button}>Logout</button>
          </li>
        ) : (
          <li style={styles.navItem}>
            <Link to="/login" style={styles.link}>Login</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: '#333',
    padding: '10px',
    display: 'flex',
    justifyContent: 'center',
  },
  navList: {
    listStyleType: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    gap: '15px',
  },
  navItem: {
    margin: 0,
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '16px',
  },
  button: {
    background: 'transparent',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
  },
};

export default Navbar;
