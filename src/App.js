import React, { Component } from 'react';
import CustInfo from './CustInfo/CustInfo.js';
import BasketContents from './BasketContents/BasketContents.js';
import './App.css';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { addCustomerInfo, addBasketContents, addTotalProducsWeight, addTotalProductsPrice } from './actions/transactionActions.js';
import store from './store.js';

class App extends Component {
  // Getting transaction information from WSCM api.
  componentDidMount = () => {
    const appObject = this;

    store.dispatch((dispatch) => {
      dispatch({type: "FOOK U"})
    })

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
          console.log(appObject.props);
          appObject.props.addBasketContents(response.products);
          appObject.props.addCustomerInfo(response.recipient);
          appObject.props.addTotalPrice(totalPrice);
          appObject.props.addTotalWeight(totalWeight);
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
    for (var i = 0; i < this.props.basket.length; i++) {
      weight += this.props.basket[i].weight;
    }
    // TODO add the dimension params
    const url = `${this.props.location.pathname}/${postcode}/${weight}`;
    this.props.history.push(url);
  }

  render() {
    console.log(this.props);
    return (
      <div className="container">
        <main className="flex-container-row">
          <CustInfo customer={this.props.customer} redirectkey= {this.props.match.params.redirectkey} onSubmit={this.handleCustomerInfoSubmit}/>
          <BasketContents basket={this.props.basket} totalPrice={this.props.totalPrice} totalWeight={this.props.totalWeight}/>
        </main>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    basket: state.transactionDetails.products,
    customer: state.transactionDetails.customerInfo,
    totalPrice: state.transactionDetails.productsPrice,
    totalWeight: state.transactionDetails.productsWeight
  }
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({
    addBasketContents: addBasketContents,             //The prop addBasketContents is equal to the function addBasketContents
    addCustomerInfo: addCustomerInfo,
    addTotalWeight: addTotalProducsWeight,
    addTotalPrice: addTotalProductsPrice}, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(App);
