import React, { Component } from 'react';
import './PaymentPage.css';
import Cards from 'react-credit-cards';
import Payment from 'payment';
import { ToastContainer, toast } from 'react-toastify';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateCcDetails, updateFocusedField } from '../actions/creditCardActions.js';

class PaymentPage extends Component {

  componentDidMount() {
      Payment.formatCardNumber(document.querySelector('[name="number"]'));
      Payment.formatCardExpiry(document.querySelector('[name="expiry"]'));
      Payment.formatCardCVC(document.querySelector('[name="cvc"]'));
    }

  onFormSubmit = (evt) => {
    evt.preventDefault();
  }

  handleInputFocus = ({ target }) => {
    this.props.updateFocusedField(target.name);
  };

  handleInputChange = ({ target }) => {
    this.props.updateCcDetails(target);
  };

  handleConfirmClick = () => {
    // TODO Processa kredit kort og svo þegar það hefur tekist þá búa til sendingu, eins og hér fyrir neðan.
    // let url = `http://localhost:8989/shipments/create`;
    //
    // let myHeaders = new Headers();
    // myHeaders.set('x-api-key', this.props.apiKey);
    // myHeaders.set('Content-Type', 'application/json');
    //
    // let myInit = {
    //   'method': 'POST',
    //   'body': JSON.stringify(''),
    //   'headers': myHeaders
    // }
    //
    // const request = new Request(url, myInit);
    //
    // fetch(request)
    // .then(response => {
    //   return response.status;
    // })
    // .then(response => {
    //   console.log(response);
    //   if (response === 200) {
    //     console.log("Tókst að búa til sendingu!!");
    //   }
    // })
    // .catch(error => {
    //   console.log("Tókst ekki að búa til sendingu.", error);
    // })
    toast("Greiðsla tókst og sending hefur verið búin til !", {type: "success"});
  }

  render() {
    const { number, name, expiry, cvc, focused } = this.props.ccDetails;
    return (
      <div className="paymentPageContainer">
        <div className="paymentPageLeftSide">
          <div className="flex-container-column costReview">
            <h3>Kostnaður:</h3>
            <span>Vörur: {this.props.basketPrice} kr.</span>
            <span>Sendingarmáti: {this.props.selectedOption.price} kr.</span>
            <span>Samtals: {this.props.basketPrice + this.props.selectedOption.price} kr.</span>
          </div>
          <div className="flex-container-column recipientReview">
            <h3>Berist til:</h3>
            <span>{this.props.customer.fullName}</span>
            <span>{this.props.customer.address}</span>
            <span>{this.props.customer.postcode}</span>
            <span>{this.props.customer.countryCode}</span>
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
                <input className="ccInputField"
                  type="tel"
                  name="number"
                  placeholder="Card Number"
                  onKeyUp={this.handleInputChange}
                  onFocus={this.handleInputFocus}
                  />
              </div>
              <div>
                <input className="ccInputField"
                  type="text"
                  name="name"
                  placeholder="Name"
                  onKeyUp={this.handleInputChange}
                  onFocus={this.handleInputFocus}
                />
              </div>
              <div>
                <input className="ccInputField"
                  type="tel"
                  name="expiry"
                  placeholder="Valid Thru"
                  onKeyUp={this.handleInputChange}
                  onFocus={this.handleInputFocus}
                />
              </div>
              <div>
                <input className="ccInputField"
                  type="tel"
                  name="cvc"
                  placeholder="CVC"
                  onKeyUp={this.handleInputChange}
                  onFocus={this.handleInputFocus}
                />
              </div>
            </form>
          </div>
          <button className="primary" onClick={this.handleConfirmClick}>Ganga frá greiðslu</button>
          <ToastContainer />
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    selectedOption: state.deliveryOptions.selectedOption,
    basketPrice: state.transactionDetails.productsPrice,
    ccDetails: state.creditCard,
    apiKey: state.transactionDetails.apiKey,
    customer: state.transactionDetails.customerInfo
  }
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({
    updateCcDetails: updateCcDetails,
    updateFocusedField: updateFocusedField
  }, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(PaymentPage);
