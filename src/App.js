import React, { Component } from 'react';
import CustInfo from './CustInfo/CustInfo.js';
import BasketContents from './BasketContents/BasketContents.js';
import './App.css';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { addTransactionDetails } from './actions/transactionActions.js';
import { changeNoDataStatus, changeCreatedStatus } from './actions/transactionActions.js';
import { addCountries } from './actions/deliveryOptionsActions.js';

class App extends Component {
  // Getting transaction information from WSCM api.
  componentDidMount = () => {
    const appObject = this;

    fetch(`http://localhost:8989/wscm/landing/${appObject.props.match.params.redirectkey}`)
      .then(response => {
        // if status is 404 then there is nothing behind the redirect key and we shouldn't display anything
        if (response.status === 404) {
          localStorage.removeItem("persist:root");
          appObject.props.dispatch({type: 'RESET_STATE'});
          appObject.props.changeNoDataStatus(true);
        }
        else {
          appObject.props.changeNoDataStatus(false);
          return response.json();
        }
      })
      .then(function(response) {
        console.log("Transaction info response:");
        console.log(response);
        // handle if the shipment has already been created and customer is trying to view the landing page again
        if (response.created) {
          localStorage.removeItem("persist:root");
          appObject.props.dispatch({type: 'RESET_STATE'});
          appObject.props.changeCreatedStatus(true);
        }
        else {
          appObject.props.changeCreatedStatus(false);

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
            // Only try to update with info from DB if there is nothing in any of the required fields. Otherwise use application state.
            // TODO decide if this is a good idea or not, or find another solution :)
            if (appObject.props.customer.fullName === '' || appObject.props.customer.address === '' || appObject.props.customer.postcode === '') {
              appObject.props.addTransactionDetails(transactionObject);
            }

          // Get all countries to populate the countries list, but ONLY if it hasn't already been loaded into state.
          // TODO this doesn't work in firefox for some reason... wtf. Have to check this out later or just leave it be.
          //if (!appObject.props.countries.length && response.apiKey !== '') {
            const url = 'http://test-ws.epost.is:8989/wscm/countries';
            let myHeaders = new Headers();
            myHeaders.set('x-api-key', response.apiKey);
            const myInit = {
                          'method': 'GET',
                          'headers': myHeaders
                        };
            const request = new Request(url, myInit);
            fetch(request)
            .then(response => {
              return response.json();
            })
            .then(response => {
              appObject.props.addCountries(response.countries);
            })
            .catch(error => {
              console.log("Ekki tókst að ná í landalista.", error);
            })
          //} // end if (!appObject.props.countries.length && response.apiKey !== '')
        } // end if (response.recipient && response.products)
        } // end else
      })
      .catch(error => {
        console.log('Tókst ekki að ná í transaction details.', error);
      })
  }

  handleCustomerInfoSubmit = () => {
    const countryCode = this.props.selectedCountry;
    const weight = this.props.totalWeight;
    const postcode = this.props.customer.postcode;

    // TODO add the dimension params
    const nextUrl = `${this.props.location.pathname}/${countryCode}/${postcode}/${weight}`;

    this.props.history.push(nextUrl);
  }

  render() {
    if (this.props.noDataStatus) {
      return (
        <div className="container">
          <main className="flex-container-row justify-center">
            <h2>Engin gögn fundust til að birta</h2>
          </main>
        </div>
      )
    }

    if (this.props.created) {
      return (
        <div className="container">
          <main className="flex-container-row justify-center">
            <h2>Sending hefur nú þegar verið búin til.</h2>
          </main>
        </div>
      )
    }

    return (
      <div className="container">
        <main className="flex-container-row">
          <CustInfo
            customer={this.props.customer}
            redirectkey={this.props.match.params.redirectkey}
            countries={this.props.countries}
            selectedCountry={this.props.selectedCountry}
            onSubmit={this.handleCustomerInfoSubmit}
          />
          <BasketContents
            basket={this.props.basket}
            totalPrice={this.props.totalPrice}
            totalWeight={this.props.totalWeight}
          />
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
    totalWeight: state.transactionDetails.productsWeight,
    countries: state.deliveryOptions.countries,
    selectedCountry: state.deliveryOptions.selectedCountry,
    noDataStatus: state.transactionDetails.noData,
    created: state.transactionDetails.created
  }
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({
    dispatch,
    addTransactionDetails: addTransactionDetails,        //The prop addTransactionDetails is equal to the function addTransactionDetails, which is imported at the top
    addCountries: addCountries,
    changeNoDataStatus: changeNoDataStatus,
    changeCreatedStatus: changeCreatedStatus
    }, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(App);
