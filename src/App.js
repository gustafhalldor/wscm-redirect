import React, { Component } from 'react';
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

  // Getting transaction information from WSCM api.
  componentDidMount = () => {
    const appObject = this;
    fetch(`http://localhost:8989/wscm/landing/${this.props.match.params.redirectkey}`)
      .then(response => {
        return response.json();
      }).then(function(response) {
        console.log("response er:");
        console.log(response);
        if (response.recipient && response.products) {
          appObject.setState({
            custInfo: response.recipient,
            basketContents: response.products
          })
        }
      }).catch(error => {
        console.log(error);
      })
  }

  // TODO
  // Aggregating finalized information on recipient and contents of order
  handleCustomerInfoSubmit = (route) => {
    console.log("er að höndla cust info submit í App component");
    const url = `${this.props.location.pathname}/${route}`;
    this.props.history.push(url);
  }

  render() {
    return (
      <div className="Container">
        <main className="flex-container">
          <CustInfo customer={this.state.custInfo} basket={this.state.basketContents} url= {this.props.match.params.redirectkey} onSubmit={this.handleCustomerInfoSubmit}/>
          <BasketContents basket={this.state.basketContents}/>
        </main>
      </div>
    );
  }
}

export default App;
