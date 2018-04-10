import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import RecipientInfo from './RecipientInfo/RecipientInfo';
import BasketContents from './BasketContents/BasketContents';
import { changeNoDataStatus, changeCreatedStatus, addTransactionDetails } from './actions/transactionActions';
import { addCountries } from './actions/deliveryOptionsActions';
import './App.css';

class App extends Component {
  // Getting transaction information from WSCM api.
  componentDidMount = () => {
    const appObject = this;

    fetch(`http://localhost:8989/wscm/v1/landing/${appObject.props.match.params.redirectkey}`)
      .then((response) => {
        // if status is 404 then there is nothing behind the redirect key
        // and we shouldn't display anything
        if (response.status === 404) {
          localStorage.removeItem('persist:root');
          appObject.props.dispatch({ type: 'RESET_STATE' });
          appObject.props.changeNoDataStatus(true);
        } else {
          appObject.props.changeNoDataStatus(false);
          return response.json();
        }
      })
      .then((response) => {
        console.log('Transaction info response:');
        console.log(response);

        if (response.created) {
          localStorage.removeItem('persist:root');
          appObject.props.dispatch({ type: 'RESET_STATE' });
          appObject.props.changeCreatedStatus(true);
        } else {
          appObject.props.changeCreatedStatus(false);

          if (response.recipient && response.products) {
            // If no recipient info was passed from the store, then it got saved as
            // 'null' in the DB. So, we have to handle those nulls.
            const recipient = {};
            Object.keys(response.recipient).forEach((key) => {
              if (response.recipient[key] === null) {
                response.recipient[key] = '';
              }
              recipient[key] = response.recipient[key];
            });

            // Erum að harðkóða countryCode því við erum bara að leyfa sendingar innanlands
            // sem stendur
            recipient.countryCode = 'IS';

            const transactionObject = {
              products: response.products,
              productsWeight: response.totalWeight,
              productsPrice: response.totalProductPrice,
              recipientInfo: recipient,
            };
            // Only try to update with info from DB if required fields are empty.
            // Otherwise use application state.
            // TODO decide if this is a good idea or not, or find another solution :)
            if (appObject.props.recipient.fullName === '' || appObject.props.recipient.address === '' || appObject.props.recipient.postcode === '') {
              appObject.props.addTransactionDetails(transactionObject);
            }

            // Populate the countries list, but ONLY if it hasn't already been loaded into state.
            // TODO the line below doesn't work in firefox for some reason... wtf.
            // if (!appObject.props.countries.length && response.apiKey !== '') {
            // TODO uncomment fetch below when we include international shipments
            // fetch(`http://localhost:3001/api/getCountries/${appObject.props.match.params.redirectkey}`)
            //   .then((response2) => {
            //     return response2.json();
            //   })
            //   .then((response3) => {
            //     console.log(response3);
            //     if (response3.status === 400) {
            //       console.log(response3.message);
            //     }
            //     appObject.props.addCountries(response3.countries);
            //   })
            //   .catch((error) => {
            //     console.log('Ekki tókst að ná í landalista.', error);
            //   });
          // } // end if (!appObject.props.countries.length && response.apiKey !== '')
          } // end if (response.recipient && response.products)
        } // end else
      })
      .catch((error) => {
        console.log('Tókst ekki að ná í transaction details.', error);
      });
  }

  handleRecipientInfoSubmit = () => {
    const nextUrl = `${this.props.location.pathname}/deliveryOptions`;

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
      );
    }

    if (this.props.created) {
      return (
        <div className="container">
          <main className="flex-container-row justify-center">
            <h2>Sending hefur nú þegar verið búin til.</h2>
          </main>
        </div>
      );
    }

    return (
      <div className="container">
        <main className="flex-container-row justify-center">
          <RecipientInfo
            recipient={this.props.recipient}
            redirectkey={this.props.match.params.redirectkey}
            countries={this.props.countries}
            selectedCountry={this.props.selectedCountry}
            onSubmit={this.handleRecipientInfoSubmit}
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
    recipient: state.transactionDetails.recipientInfo,
    totalPrice: state.transactionDetails.productsPrice,
    totalWeight: state.transactionDetails.productsWeight,
    countries: state.deliveryOptions.countries,
    selectedCountry: state.transactionDetails.recipientInfo.countryCode,
    noDataStatus: state.transactionDetails.noData,
    created: state.transactionDetails.shipmentCreatedAndPaidForSuccessfully,
  };
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({
    dispatch,
    addTransactionDetails,
    addCountries,
    changeNoDataStatus,
    changeCreatedStatus,
  }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(App);
