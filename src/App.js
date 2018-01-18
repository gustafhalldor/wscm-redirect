import React, { Component } from 'react';
import CustInfo from './CustInfo/CustInfo.js';
import BasketContents from './BasketContents/BasketContents.js';
import './App.css';
//import mockContents from './BasketContents/mockContents.json';
//import fetch from 'node-fetch';

class App extends Component {
  state = {
    custInfo: {},
    basketContents: [],
    totalPrice: 0,
    totalWeight: 0
  };

  // Getting transaction information from WSCM api.
  componentDidMount = () => {
    const appObject = this;
    fetch(`http://localhost:8989/wscm/landing/${this.props.match.params.redirectkey}`)
      .then(response => {
        return response.json();
      })
      .then(function(response) {
        console.log("response er:");
        console.log(response);
        if (response.recipient && response.products) {
          let totalWeight = 0, totalPrice = 0;
          for (var i = 0; i < response.products.length; i++) {
            totalWeight += response.products[i].weight;
            totalPrice += response.products[i].price;
          }
          appObject.setState({
            custInfo: response.recipient,
            basketContents: response.products,
            totalPrice,
            totalWeight
          })
        }
      })
      .catch(error => {
        console.log('Tókst ekki að ná í transaction details', error);
      })
  }

  // TODO
  // Aggregating finalized information on recipient and contents of order
  handleCustomerInfoSubmit = (postcode) => {
    console.log("er að höndla cust info submit í App component");
    let weight = 0;
    for (var i = 0; i < this.state.basketContents.length; i++) {
      weight += this.state.basketContents[i].weight;
    }
    // TODO add the dimension params
    const url = `${this.props.location.pathname}/${postcode}/${weight}`;
    this.props.history.push(url);
  }

  render() {
    return (
      <div className="container">
        <main className="flex-container-row">
          <CustInfo customer={this.state.custInfo} basket={this.state.basketContents} redirectkey= {this.props.match.params.redirectkey} onSubmit={this.handleCustomerInfoSubmit}/>
          <BasketContents basket={this.state.basketContents} totalPrice={this.state.totalPrice} totalWeight={this.state.totalWeight}/>
        </main>
      </div>
    );
  }
}

export default App;
