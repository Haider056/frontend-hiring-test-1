import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../Styles/logo.png';
import { handleLogout } from '../services/api';

const Header = () => {
  const navigate = useNavigate();

  const logout = () => {
    handleLogout(navigate); 
  };

  return (
    <nav className="navbar navbar-light bg-light">
      <div className="container">
        <a className="navbar-brand" href="/">
          <img src={logo} alt="Turing Technologies" width="280" height="40" className="d-inline-block align-top" />
        </a>
        <button className="btn btn-primary" onClick={logout}>Log out</button>
      </div>
    </nav>
  );
};

export default Header;
