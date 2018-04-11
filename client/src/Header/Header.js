import React from 'react';
import logo from '../logo-postur.svg';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <img src={logo} className="logo" alt="logo" />
    </header>
  );
};

export default Header;
