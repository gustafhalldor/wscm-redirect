import React, { Component } from 'react';
import CustInfo from './CustInfo/CustInfo.js';
import BasketContents from './BasketContents/BasketContents.js';
import './App.css';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { addTransactionDetails } from './actions/transactionActions.js';
import reduxStore from './store.js';
let { store } = reduxStore();

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
        console.log("Transaction info response:");
        console.log(response);
        if (response.recipient && response.products) {
          let totalWeight = 0, totalPrice = 0;
          for (var i = 0; i < response.products.length; i++) {
            totalWeight += response.products[i].weight;
            totalPrice += response.products[i].price;
          }
          const transactionObject = {
            apiKey: response.apiKey,
            products: response.products,
            productsWeight: totalWeight,
            productsPrice: totalPrice,
            customerInfo: response.recipient
          }
          appObject.props.addTransactionDetails(transactionObject);
        }
      })
      .catch(error => {
        console.log('Tókst ekki að ná í transaction details', error);
      })
  }

  // TODO
  // Aggregating finalized information on recipient and contents of order
  handleCustomerInfoSubmit = (postcode) => {
    const weight = this.props.totalWeight;
    // TODO add the dimension params
    const nextUrl = `${this.props.location.pathname}/${postcode}/${weight}`;

    this.props.history.push(nextUrl);
  }

  render() {
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
    addTransactionDetails: addTransactionDetails,        //The prop addTransactionDetails is equal to the function addTransactionDetails, which is imported at the top
    }, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(App);
