import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import RecipientInfo from '../RecipientInfo/RecipientInfo';
import BasketContents from '../BasketContents/BasketContents';
import { changeNoDataStatus, changePaidStatus, addTransactionDetails } from '../actions/transactionActions';
import { addCountries, addPostcodes } from '../actions/deliveryOptionsActions';

class LandingPage extends Component {
  // Getting transaction information from WSCM api.
  componentDidMount = () => {
    fetch(`http://localhost:3001/api/getTransactionDetails/${this.props.match.params.redirectkey}`)
      .then((response) => {
        // if status is 404 then there is nothing behind the redirect key
        // and we shouldn't display anything
        if (response.status === 404) {
          localStorage.removeItem('persist:root');
          this.props.dispatch({ type: 'RESET_STATE' });
          this.props.changeNoDataStatus(true);
          return;
        } else {
          this.props.changeNoDataStatus(false);
          return response.json();
        }
      })
      .then((response) => {
        console.log('Transaction info response:');
        console.log(response);

        if (response.paid) {
          localStorage.removeItem('persist:root');
          this.props.dispatch({ type: 'RESET_STATE' });
          this.props.changePaidStatus(true);
        } else {
          this.props.changePaidStatus(false);

          // TODO: Höndla else skilyrðið? Taka if-ið bara út? APInn er með tjekk svo hann ætti alltaf að skila streng.
          if (response.products) {
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
            if (this.props.recipient.fullName === '' || this.props.recipient.address === '' || this.props.recipient.postcode === '') {
              this.props.addTransactionDetails(transactionObject);
            }

            // Populate the countries list, but ONLY if it hasn't already been loaded into state.
            // TODO the line below doesn't work in firefox for some reason... wtf.
            // if (!this.props.countries.length && response.apiKey !== '') {
            // TODO uncomment fetch below when we include international shipments
            // fetch(`http://localhost:3001/api/getCountries/${this.props.match.params.redirectkey}`)
            //   .then((response2) => {
            //     return response2.json();
            //   })
            //   .then((response3) => {
            //     console.log(response3);
            //     if (response3.status === 400) {
            //       console.log(response3.message);
            //     }
            //     this.props.addCountries(response3.countries);
            //   })
            //   .catch((error) => {
            //     console.log('Ekki tókst að ná í landalista.', error);
            //   });
          // } // end if (!this.props.countries.length && response.apiKey !== '')
            // if (!this.props.postcodes.length) {
            //   fetch(`http://localhost:3001/api/getPostcodes/${this.props.match.params.redirectkey}`)
            //     .then((response) => {
            //       return response.json();
            //     })
            //     .then((response) => {
            //       console.log(response);
            //       this.props.addPostcodes(response.postcodes);
            //     })
            //     .catch((error) => {
            //       console.log(error);
            //     })
            // }
          } // end if (response.products)
        } // end else
      })
      .catch((error) => {
        console.log('Tókst ekki að ná í transaction details.', error);
      });
  };

  handleRecipientInfoSubmit = () => {
    const nextUrl = `${this.props.location.pathname}/deliveryOptions`;

    this.props.history.push(nextUrl);
  };

  render() {
    const {noDataStatus, isPaid} = this.props;

    if (noDataStatus) {
      return (
        <div className="container">
          <main className="flex-container-row justify-center">
            <h2>Engin gögn fundust til að birta</h2>
          </main>
        </div>
      );
    }

    if (isPaid) {
      return (
        <div className="container">
          <main className="flex-container-row justify-center">
            <h2>Sending hefur nú þegar verið greidd.</h2>
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
            postcodes={this.props.postcodes}
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
    postcodes: state.deliveryOptions.postcodes,
    selectedCountry: state.transactionDetails.recipientInfo.countryCode,
    noDataStatus: state.transactionDetails.noData,
    isPaid: state.transactionDetails.shipmentPaid,
  };
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({
    dispatch,
    addTransactionDetails,
    addCountries,
    changeNoDataStatus,
    changePaidStatus,
    addPostcodes,
  }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(LandingPage);
