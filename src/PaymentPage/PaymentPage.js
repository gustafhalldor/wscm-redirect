import React, { Component } from 'react';
import './PaymentPage.css';
import Cards from 'react-credit-cards';
import Payment from 'payment';
import { ToastContainer, toast } from 'react-toastify';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateCcDetails, updateFocusedField } from '../actions/creditCardActions.js';
import { changeCreatedStatus } from '../actions/transactionActions.js';

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

    if (this.props.created) {
      toast("Sending hefur nú þegar verið búin til !", {type: "warning"});
      return;
    }

    // TODO Processa kredit kort og svo þegar það hefur tekist ÞÁ búa til sendingu, eins og hér fyrir neðan.
    let url = `http://localhost:8989/wscm/shipments/create`;

    let myHeaders = new Headers();
    myHeaders.set('x-api-key', this.props.apiKey);
    myHeaders.set('Content-Type', 'application/json');

    const shipment = {
      recipient: {
        name: this.props.customer.fullName,
        addressLine1: this.props.customer.address,
        postcode: this.props.customer.postcode,
        countryCode: this.props.selectedCountry
      },
      options: {
        deliveryServiceId: this.props.selectedOption.id
      }
    };

    let myInit = {
      'method': 'POST',
      'body': JSON.stringify(shipment),
      'headers': myHeaders
    }

    const request = new Request(url, myInit);

    fetch(request)
    .then(response => {
      return response.status;
    })
    .then(response => {
      if (response === 201) {
        toast("Sending hefur verið búin til !", {type: "success"});

        this.props.changeCreatedStatus(true);

        // Flag shipment as 'CREATED'
        let url2 = `http://localhost:8989/wscm/landing/${this.props.match.params.redirectkey}`;
        let myHeaders2 = new Headers();
        myHeaders2.set('Content-Type', 'application/json');
        const status = true;

        let myInit2 = {
          'method': 'PUT',
          'body': JSON.stringify(status),
          'headers': myHeaders2
        }

        const request2 = new Request(url2, myInit2);

        fetch(request2)
        .then(response => {
          console.log(response.status);
          return response.status;
        })
        .then(response => {

        })
      }
    })
    .catch(error => {
      console.log("Tókst ekki að búa til sendingu.", error);
    })
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
            <span>{this.props.selectedCountry}</span>
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
    customer: state.transactionDetails.customerInfo,
    created: state.transactionDetails.created,
    selectedCountry: state.deliveryOptions.selectedCountry
  }
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({
    updateCcDetails: updateCcDetails,
    updateFocusedField: updateFocusedField,
    changeCreatedStatus: changeCreatedStatus
  }, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(PaymentPage);
