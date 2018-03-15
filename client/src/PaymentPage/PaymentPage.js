import React, { Component } from 'react';
import Cards from 'react-credit-cards';
import Payment from 'payment';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import fetch from 'isomorphic-fetch';
import { updateCcDetails, updateFocusedField } from '../actions/creditCardActions';
import { changeCreatedStatus, changeIsSenderRecipient, changeSenderEmailAddress } from '../actions/transactionActions';
import './PaymentPage.css';

class PaymentPage extends Component {
  componentDidMount() {
    if (this.props.created) {
      return;
    }
    Payment.formatCardNumber(document.querySelector('[name="number"]'));
    Payment.formatCardExpiry(document.querySelector('[name="expiry"]'));
    Payment.formatCardCVC(document.querySelector('[name="cvc"]'));
  }

  onFormSubmit = (evt) => {
    evt.preventDefault();
  }

  handleCcInputFocus = ({ target }) => {
    this.props.updateFocusedField(target.name);
  };

  handleCcInputChange = ({ target }) => {
    this.props.updateCcDetails(target);
  };

  handleCheckboxChange = () => {
    this.props.changeIsSenderRecipient();
  }

  handleEmailChange = ({ target }) => {
    this.props.changeSenderEmailAddress(target.value);
  }

  handleConfirmClick = () => {
    if (this.props.created) {
      toast('Sending hefur nú þegar verið búin til !', { type: 'warning' });
      return;
    }

    // TODO Processa kredit kort og SVO búa til sendingu (eins og hér fyrir neðan).
    const url = `http://localhost:3001/api/createShipment/${this.props.match.params.redirectkey}`;

    const myHeaders = new Headers();
    myHeaders.set('Content-Type', 'application/json');

    const shipment = {
      recipient: {
        name: this.props.customer.fullName,
        addressLine1: this.props.customer.address,
        postcode: this.props.customer.postcode,
        countryCode: this.props.selectedCountry,
      },
      options: {
        deliveryServiceId: this.props.selectedOption.id,
      },
    };

    const myInit = {
      method: 'POST',
      body: JSON.stringify(shipment),
      headers: myHeaders,
    };

    const request = new Request(url, myInit);

    fetch(request)
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        if (response.status === 201) {
        //  toast('Sending hefur verið búin til !', { type: 'success' });

          this.props.changeCreatedStatus(true);

          // START flag shipment as 'CREATED' on the backend.
          const url2 = `http://localhost:8989/wscm/landing/${this.props.match.params.redirectkey}`;
          const myHeaders2 = new Headers();
          myHeaders2.set('Content-Type', 'application/json');
          const status = true;

          const myInit2 = {
            method: 'PUT',
            body: JSON.stringify(status),
            headers: myHeaders2,
          };

          const request2 = new Request(url2, myInit2);

          fetch(request2)
            .then((response2) => {
              console.log(response2.status);
              return response2.status;
            });
          // END flag shipment as 'CREATED' on the backend.
        // END if
        } else {
          console.log(response.message);
        }

        const location = {
          pathname: `/${this.props.match.params.redirectkey}/final`,
        };

        this.props.history.push(location);
      })
      .catch((error) => {
        console.log('Tókst ekki að búa til sendingu.', error);
      });
  }

  render() {
    // If shipment has already been created from this redirect key
    if (this.props.created) {
      return (
        <div className="container">
          <main className="flex-container-row justify-center">
            <h2>Sending hefur nú þegar verið búin til.</h2>
          </main>
        </div>
      );
    }

    const { number, name, expiry, cvc, focused } = this.props.ccDetails;
    const deliveryOptionsPageUrl = `/${this.props.match.params.redirectkey}/deliveryOptions`;

    return (
      <div className="paymentPageContainer">
        <div className="paymentPageContent">
          <div className="paymentPageLeftSide">
            <div className="flex-container-column costReview">
              <h3>Kostnaður:</h3>
              <table className="table">
                <tbody>
                  <tr>
                    <td>Vörur:</td>
                    <td>{this.props.basketPrice} kr.</td>
                  </tr>
                  <tr>
                    <td>Sendingarmáti:</td>
                    <td>{this.props.selectedOption.price} kr.</td>
                  </tr>
                  <tr>
                    <td>Samtals:</td>
                    <td>{this.props.basketPrice + this.props.selectedOption.price} kr.</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex-container-column recipientReview">
              <h3>Berist til:</h3>
              <table className="table">
                <tbody>
                  <tr>
                    <td>Nafn:</td>
                    <td>{this.props.customer.fullName}</td>
                  </tr>
                  <tr>
                    <td>Heimilisfang:</td>
                    <td>{this.props.customer.address}</td>
                  </tr>
                  <tr>
                    <td>Póstnúmer:</td>
                    <td>{this.props.customer.postcode}</td>
                  </tr>
                  <tr>
                    <td>Land:</td>
                    <td>{this.props.selectedCountry}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex-container-column">
              <div>
                <label className="senderNotRecipientLabel" htmlFor="senderNotRecipientCheckbox">Sendandi er EKKI viðtakandi</label>
                <input
                  type="checkbox"
                  id="senderNotRecipientCheckbox"
                  name="senderNotRecipientCheckbox"
                  onChange={this.handleCheckboxChange}
                  checked={this.props.senderCheckbox}
                />
              </div>
              {this.props.senderCheckbox &&
                <div className="flex-container-column">
                  <input
                    type="text"
                    placeholder="joi@island.is"
                    onChange={this.handleEmailChange}
                    value={this.props.senderEmailAddress}
                  />
                  <span>Kvittun verður send á ofangreint tölvupóstfang.</span>
                </div>
              }
            </div>
          </div>
          <div className="paymentPageRightSide">
            <h3>Greiðsluupplýsingar</h3>
            <div>
              <Cards
                number={number}
                name={name}
                expiry={expiry}
                cvc={cvc}
                focused={focused}
              />
            </div>
            <div className="creditCardForm ">
              <form onSubmit={this.onFormSubmit}>
                <div>
                  <input
                    className="ccInputField"
                    type="tel"
                    name="number"
                    placeholder="Card Number"
                    onKeyUp={this.handleCcInputChange}
                    onFocus={this.handleCcInputFocus}
                  />
                </div>
                <div>
                  <input
                    className="ccInputField"
                    type="text"
                    name="name"
                    placeholder="Name"
                    onKeyUp={this.handleCcInputChange}
                    onFocus={this.handleCcInputFocus}
                  />
                </div>
                <div>
                  <input
                    className="ccInputField"
                    type="tel"
                    name="expiry"
                    placeholder="Valid Thru"
                    onKeyUp={this.handleCcInputChange}
                    onFocus={this.handleCcInputFocus}
                  />
                </div>
                <div>
                  <input
                    className="ccInputField"
                    type="tel"
                    name="cvc"
                    placeholder="CVC"
                    onKeyUp={this.handleCcInputChange}
                    onFocus={this.handleCcInputFocus}
                  />
                </div>
              </form>
            </div>
            <ToastContainer />
          </div>
        </div>
        <div className="flex-container-row paymentPageButtons">
          <Link to={deliveryOptionsPageUrl}><button className="btn deliveryOptionsBackButton">Til baka í sendingarmáta</button></Link>
          <button className="btn primary" onClick={this.handleConfirmClick}>Ganga frá greiðslu</button>
        </div>
      </div>
    );
  }
}

PaymentPage.propTypes = {
  customer: PropTypes.shape({
    fullName: PropTypes.string,
    address: PropTypes.string,
    postcode: PropTypes.string,
  }),
  selectedOption: PropTypes.shape({
    price: PropTypes.number,
    id: PropTypes.string,
  }),
  ccDetails: PropTypes.shape({
    number: PropTypes.string,
    name: PropTypes.string,
    expiry: PropTypes.string,
    cvc: PropTypes.string,
    focused: PropTypes.string,
  }),
  basketPrice: PropTypes.number,
  selectedCountry: PropTypes.string,
  created: PropTypes.bool,
  changeCreatedStatus: PropTypes.func,
  updateFocusedField: PropTypes.func,
  updateCcDetails: PropTypes.func,
};

function mapStateToProps(state) {
  return {
    selectedOption: state.deliveryOptions.selectedOption,
    basketPrice: state.transactionDetails.productsPrice,
    ccDetails: state.creditCard,
    apiKey: state.transactionDetails.apiKey,
    customer: state.transactionDetails.customerInfo,
    created: state.transactionDetails.shipmentCreatedAndPaidForSuccessfully,
    selectedCountry: state.transactionDetails.customerInfo.countryCode,
    senderCheckbox: state.transactionDetails.isSenderRecipient,
    senderEmailAddress: state.transactionDetails.senderEmailAddress,
  };
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({
    updateCcDetails,
    updateFocusedField,
    changeCreatedStatus,
    changeIsSenderRecipient,
    changeSenderEmailAddress,
  }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(PaymentPage);
