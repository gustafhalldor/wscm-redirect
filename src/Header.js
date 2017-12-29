import React, { Component } from 'react';
import logo from './logo-postur.svg';
import styles from './App.css';

class Header extends Component {
  render() {
    return (
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
    );
  }
}

export default Header;
