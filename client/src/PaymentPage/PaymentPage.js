import React, { Component } from 'react';
import Cards from 'react-credit-cards';
import Payment from 'payment';
import { ToastContainer, toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import fetch from 'isomorphic-fetch';
import { updateCcDetails, updateFocusedField } from '../actions/creditCardActions';
import { changeCreatedStatus } from '../actions/transactionActions';
import './PaymentPage.css';

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

  onBackButtonClick = () => {
    this.props.history.push(`/${this.props.match.params.redirectkey}/deliveryOptions`);
  };

  handleConfirmClick = () => {
    if (this.props.created) {
      toast('Sending hefur nú þegar verið búin til !', { type: 'warning' });
      return;
    }

    // TODO Processa kredit kort og SVO búa til sendingu (eins og hér fyrir neðan).
    // let url = `http://localhost:8989/wscm/shipments/create`;
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
          toast('Sending hefur verið búin til !', { type: 'success' });

          this.props.changeCreatedStatus(true);

          //TODO: EYÐA út úr localstorage

          // Flag shipment as 'CREATED'
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
        } else {
          console.log(response.message);
        }
      })
      .catch((error) => {
        console.log('Tókst ekki að búa til sendingu.', error);
      });
  }

  render() {
    const { number, name, expiry, cvc, focused } = this.props.ccDetails;
    return (
      <div className="paymentPageContainer">
        <div className="paymentPageContent">
          <div className="paymentPageLeftSide">
            <div className="flex-container-column costReview">
              <h3>Kostnaður:</h3>
          {/*    <div className="table-responsive">  */}
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
          {/*    </div> */}
            </div>
            <div className="flex-container-column recipientReview">
              <h3>Berist til:</h3>
          {/*     <div className="table-responsive">  */}
                <table className="table">
                  <tbody>
                    <tr>
                      <td>Nafn:</td>
                      <td>{this.props.customer.fullName} langalangalanganafnið</td>
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
          {/*    </div>  */}
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
                    onKeyUp={this.handleInputChange}
                    onFocus={this.handleInputFocus}
                  />
                </div>
                <div>
                  <input
                    className="ccInputField"
                    type="text"
                    name="name"
                    placeholder="Name"
                    onKeyUp={this.handleInputChange}
                    onFocus={this.handleInputFocus}
                  />
                </div>
                <div>
                  <input
                    className="ccInputField"
                    type="tel"
                    name="expiry"
                    placeholder="Valid Thru"
                    onKeyUp={this.handleInputChange}
                    onFocus={this.handleInputFocus}
                  />
                </div>
                <div>
                  <input
                    className="ccInputField"
                    type="tel"
                    name="cvc"
                    placeholder="CVC"
                    onKeyUp={this.handleInputChange}
                    onFocus={this.handleInputFocus}
                  />
                </div>
              </form>
            </div>
            <ToastContainer />
          </div>
        </div>
        <div className="flex-container-row paymentPageButtons">
          <button className="btn" onClick={this.onBackButtonClick}>Til baka</button>
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
    created: state.transactionDetails.created,
    selectedCountry: state.deliveryOptions.selectedCountry,
  };
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({
    updateCcDetails,
    updateFocusedField,
    changeCreatedStatus,
  }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(PaymentPage);
