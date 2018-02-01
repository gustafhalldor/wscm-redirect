import React, { Component } from 'react';
import './PaymentPage.css';
import Cards from 'react-credit-cards';
import { ToastContainer, toast } from 'react-toastify';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateCcDetails, updateFocusedField } from '../actions/creditCardActions.js';

class PaymentPage extends Component {

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
    // TODO ná í upplýsingar um sendandann út frá API lyklinum
    // TODO búa svo til sendinguna eftir að greiðslan fer í gegn
    toast("Greiðsla tókst og sending hefur verið búin til !", {type: "success"});
  }

  render() {
    const { number, name, expiry, cvc, focused } = this.props.ccDetails;
    return (
      <div className="container">
        <div className="paymentPageLeftSide">
          <div>
            <h3>Samantekt</h3>
          </div>
          <div className="flex-container-column costReview">
            <span>Vörur: {this.props.basketPrice} kr.</span>
            <span>Sendingarmáti: {this.props.selectedOption.price} kr.</span>
            <span>Samtals: {this.props.basketPrice + this.props.selectedOption.price} kr.</span>
          </div>
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
          <button className="primary" onClick={this.handleConfirmClick}>Borga</button>
          <ToastContainer />
        </div>
        <div className="paymentPageRightSide col-md-4">

        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    selectedOption: state.deliveryOptions.selectedOption,
    basketPrice: state.transactionDetails.productsPrice,
    ccDetails: state.creditCard
  }
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({
    updateCcDetails: updateCcDetails,
    updateFocusedField: updateFocusedField
  }, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(PaymentPage);
