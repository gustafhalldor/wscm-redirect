import React, { Component } from 'react';
import Cards from 'react-credit-cards';
import Payment from 'payment';
import Validator from 'validator';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// import fetch from 'isomorphic-fetch';
import { saveCustomerEmailAddress, createShipmentAndProcessPayment, getCurrentMonthAndYear } from './PaymentPageHelpers';
import { updateCcDetails, updateFocusedField, updateFieldError, clickedSubmitButton } from '../actions/creditCardActions';
import { addChargeResponse, changePriceMismatch, changeUnauthorizedStatus, changeProcessingPaymentStatus, changePaidStatus, changepayerIsNotRecipient, changepayerEmailAddress, updatepayerEmailAddressValidation } from '../actions/transactionActions';
import './paymentPage.css';

class PaymentPage extends Component {
  componentDidMount() {
    if (this.props.isPaid || this.props.unauthorized) {
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
    if (target.name === 'name') {
      this.checkCcNameValidation(target.value);
    }
    if (target.name === 'expiry') {
      this.checkCcExpiryDateValidation(target.value);
    }
    if (target.name === 'cvc') {
      this.checkCcCvcValidation(target.value);
    }
    this.props.updateCcDetails(target);
  };

  handleCheckboxChange = () => {
    this.props.changepayerIsNotRecipient();
  }

  handleEmailChange = ({ target }) => {
    const value = target.value;
    console.log(value);
    let errorMessage = '';
    let isValid = false;
    if (Validator.isEmail(value)) {
      isValid = true;
    } else {
      if (value.length === 0) {
        errorMessage = 'Vantar tölvupóstfang';
      } else errorMessage = 'Ekki á réttu formi';
    }

    this.props.updatepayerEmailAddressValidation({ isValid, errorMessage })
    this.props.changepayerEmailAddress(value);
  }

  checkCcNumberValidation = (type, isValid) => {
    let message = '';
    if (!isValid) {
      message = 'Kortanúmer er ekki gilt';
    }

    this.props.updateFieldError({ name: 'number', value: isValid, errorMessage: message });
  }

  checkCcNameValidation = (value) => {
    // tjekka hvort það sé eitthvað skrifað inní name fieldið
    let isValid = false;
    if (value !== '') {
      isValid = true;
    }

    let message = '';
    if (isValid !== this.props.isCcFieldValid.name) {
      if (!isValid) {
        message = 'Skrifaðu nafn korthafa';
      }

      this.props.updateFieldError({ name: 'name', value: isValid, errorMessage: message })
    }
  }

  checkCcExpiryDateValidation = (value) => {
    let isValid = false;
    let message = '';

    // legal inputs are either 'mm / yy' or 'mm / yyyy'
    if (value.length === 7 || value.length === 9) {
      isValid = true;
      const splitValue = value.split(' / ');
      const inputMonth = parseInt(splitValue[0], 10);
      let inputYearString = splitValue[1];
      if (inputYearString.length === 2) inputYearString = `20${inputYearString}`;
      const inputYearNumber = parseInt(inputYearString, 10);
      const { month, year } = getCurrentMonthAndYear();

      if (inputMonth < 1 || inputMonth > 12) {
        message = 'Mánuður er ekki til.';
        isValid = false;
      }

      if (inputYearNumber < year || (year === inputYearNumber && inputMonth < month)) {
        message = 'Kort virðist vera útrunnið...';
        isValid = false;
      }
    } else {
      isValid = false;
      message = 'Athugaðu gildistíma kortsins';
    }

    this.props.updateFieldError({ name: 'expiry', value: isValid, errorMessage: message });
  }

  checkCcCvcValidation = (value) => {
    let isValid = false;
    let message = '';
    if (value !== '') {
      if (value.length > 0 && value.length < 3) {
        message = 'Öryggisnúmer eru 3-4 tölustafir';
        isValid = false;
      } else isValid = true;
    } else message = 'Vantar öryggisnúmer';

    this.props.updateFieldError({ name: 'cvc', value: isValid, errorMessage: message });
  }

  handleConfirmClick = () => {
    // Ætti aldrei að gerast, eeeen allt í lagi að hafa þetta inni
    if (this.props.isPaid) {
      toast('Búið er að greiða fyrir sendingu !', { type: 'warning' });
      return;
    }
    this.props.clickedSubmitButton(true);

    // athuga breytur sem halda utan um hvort innsláttur sé gildur eða ekki
    // hlaupa í gegnum error objectinn og ef einhver þeirra er false þá returna
    // TODO uncommenta næstu 3 línur fyrir CC validation
    // for (const key of Object.keys(this.props.isCcFieldValid)) {
    //   if(this.props.isCcFieldValid[key] === false) return;
    // }
    // sama á við um hvort email viðskiptavinar sé gilt...
    if (/*this.props.payerCheckbox && */!this.props.payerEmailAddressIsValid) {
      return;
    }

    const redirectkey = this.props.match.params.redirectkey;
    saveCustomerEmailAddress(redirectkey, this.props.payerEmailAddress);

    const finalPage = {
      pathname: `/${this.props.match.params.redirectkey}/final`,
    };
    // Bý til sendingu og svo er kreditkort processað.
    const totalAmount = this.props.basketPrice + this.props.selectedOption.price;
    this.props.changeProcessingPaymentStatus(true);
    createShipmentAndProcessPayment(redirectkey, this.props.recipient, this.props.payerEmailAddress, this.props.selectedCountry, this.props.selectedOption.id, this.props.ccDetails, totalAmount)
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          this.props.changePaidStatus(true);
          this.props.addChargeResponse(response.body);
          this.props.history.push(finalPage);
        }
        if (response.status === 400) {
          this.props.changeProcessingPaymentStatus(false);
          this.props.changePriceMismatch(true);
          this.props.history.push(`/${this.props.match.params.redirectkey}/payment`);
        }
        if (response.status === 401) {
          this.props.changeProcessingPaymentStatus(false);
          this.props.changeUnauthorizedStatus(true);
          this.props.history.push(`/${this.props.match.params.redirectkey}/payment`);
        }
      })
      .catch((error) => {
        // TODO: Senda tölvupóst á okkur ef þetta gerist?
        console.log('Tókst ekki að búa til og greiða sendingu.', error);
      });
  }

  render() {
    if (this.props.isProcessingPayment) {
      return (
        <div className="container">
          <main className="flex-container-row justify-center">
            <h2>... er að framkvæma greiðslu ...</h2>
          </main>
        </div>
      );
    }

    // If shipment has already been created from this redirect key and paid for.
    if (this.props.isPaid) {
      return (
        <div className="container">
          <main className="flex-container-row justify-center">
            <h2>Sending hefur nú þegar verið greidd.</h2>
          </main>
        </div>
      );
    }

    if (this.props.unauthorized) {
      return (
        <div className="container">
          <main className="flex-container-row justify-center">
            <h2>Ekki tókst að framkvæma aðgerð.</h2>
          </main>
        </div>
      );
    }

    // If there is a problem with the CC input we aggregate them into a bullet list
    let errorMessages = [];
    for (const key in this.props.errorMessages) {
      if (this.props.isCcFieldValid[key] === false) {
        errorMessages.push(
          <li key={key}>{this.props.errorMessages[key]}</li>
        );
      }
    }
    if (/*this.props.payerCheckbox && */!this.props.payerEmailAddressIsValid) {
      errorMessages.push(
        <li key="email">{this.props.payerEmailAddressErrorMessage}</li>
      );
    }

    const { number, name, expiry, cvc, focused } = this.props.ccDetails;
    const deliveryOptionsPageUrl = `/${this.props.match.params.redirectkey}/deliveryOptions`;

    return (
      <div className="paymentPageContainer">
        {
          this.props.priceMismatch === true ?
            <span>Ekki samræmi milli verðs á server og í client. Vinsamlegast reyndu aftur.</span> :
            <span></span>
        }
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
                    <td>{this.props.recipient.fullName}</td>
                  </tr>
                  <tr>
                    <td>Staður:</td>
                    <td>{this.props.recipient.address}</td>
                  </tr>
                  <tr>
                    <td>Póstnúmer:</td>
                    <td>{this.props.recipient.postcode}</td>
                  </tr>
                  <tr>
                    <td>Land:</td>
                    <td>{this.props.selectedCountry}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex-container-column">
          {/*    <div>
                <label className="payerNotRecipientLabel" htmlFor="payerNotRecipientCheckbox">Greiðandi er EKKI viðtakandi</label>
                <input
                  type="checkbox"
                  id="payerNotRecipientCheckbox"
                  name="payerNotRecipientCheckbox"
                  onChange={this.handleCheckboxChange}
                  checked={this.props.payerCheckbox}
                />
              </div> */}
          {/*    {this.props.payerCheckbox &&  */}
              <div className="flex-container-column">
                <label htmlFor="payerEmailAddress">Tölvupóstfang greiðanda</label>
                <input
                  type="text"
                  name="payerEmailAddress"
                  placeholder="t.d. gudni@island.is"
                  onChange={this.handleEmailChange}
                  value={this.props.payerEmailAddress}
                />
                <span>Kvittun verður send á ofangreint tölvupóstfang</span>
              </div>
      {/*        } */}
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
                callback={this.checkCcNumberValidation}
              />
            </div>
            <div className="creditCardForm">
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
          <Link to={deliveryOptionsPageUrl}><button className="btn paymentPageOptionsBackButton paymentPageButton text-uppercase">Aftur í sendingarmáta</button></Link>
          <button className="btn primary paymentPageButton text-uppercase" onClick={this.handleConfirmClick}>Ganga frá greiðslu</button>
        </div>
        <div className="flex-container-column paymentPageErrorMessages">
          {this.props.wasSubmitButtonJustClicked ? errorMessages : ''}
        </div>
      </div>
    );
  }
}

PaymentPage.propTypes = {
  recipient: PropTypes.shape({
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
    recipient: state.transactionDetails.recipientInfo,
    priceMismatch: state.transactionDetails.priceMismatch,
    unauthorized: state.transactionDetails.unauthorized,
    isPaid: state.transactionDetails.shipmentPaid,
    isProcessingPayment: state.transactionDetails.isProcessingPayment,
    selectedCountry: state.transactionDetails.recipientInfo.countryCode,
    payerCheckbox: state.transactionDetails.payerIsNotRecipient,
    payerEmailAddress: state.transactionDetails.payerEmailAddress,
    payerEmailAddressIsValid: state.transactionDetails.payerEmailAddressIsValid,
    payerEmailAddressErrorMessage: state.transactionDetails.payerEmailAddressErrorMessage,
    isCcFieldValid: state.creditCard.inputIsValid,
    errorMessages: state.creditCard.inputErrorMessages,
    wasSubmitButtonJustClicked: state.creditCard.submitButtonClicked,
  };
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({
    updateCcDetails,
    updateFocusedField,
    changePaidStatus,
    changeProcessingPaymentStatus,
    changepayerIsNotRecipient,
    changepayerEmailAddress,
    updateFieldError,
    clickedSubmitButton,
    updatepayerEmailAddressValidation,
    addChargeResponse,
    changePriceMismatch,
    changeUnauthorizedStatus,
  }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(PaymentPage);
