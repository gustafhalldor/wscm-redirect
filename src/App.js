import React, { Component } from 'react';
import Header from './Header/Header.js';
import CustInfo from './CustInfo/CustInfo.js';
import BasketContents from './BasketContents/BasketContents.js';
import './App.css';
//import mockContents from './BasketContents/mockContents.json';
//import fetch from 'node-fetch';

class App extends Component {
  state = {
    custInfo: {},
    basketContents: []
  };

  componentDidMount = () => {
    console.log(this.props.match.params.redirectkey);
    const appObject = this;
    fetch(`http://localhost:8989/wscm/landing/${this.props.match.params.redirectkey}`)
      .then(response => {
        return response.json();
      }).then(function(response) {
        console.log("response er:");
        console.log(response);
        appObject.setState({
          custInfo: response.recipient,
          basketContents: response.products
        })
      });
  }

  render() {
    return (
      <div className="Container">
        <Header />
        <main className="flex-container">
          <CustInfo customer={this.state.custInfo}/>
          <BasketContents basket={this.state.basketContents}/>
        </main>
      </div>
    );
  }
}

export default App;
