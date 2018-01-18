import React, { Component } from 'react';
import './PaymentPage.css';
import Cards from 'react-credit-cards';
import { ToastContainer, toast } from 'react-toastify';

class PaymentPage extends Component {

  state = {
    basketContents: [],
    basketPrice: 0,
    deliveryPrice: 0,
    number: "",
    name: "",
    expiry: "",
    cvc: "",
    focused: ""
  }

  componentDidMount = () => {
    const appObject = this;
    fetch(`http://localhost:8989/wscm/landing/${this.props.match.params.redirectkey}`)
      .then(response => {
        return response.json();
      })
      .then(function(response) {
        console.log("response er:");
        console.log(response);
        if (response.recipient && response.products) {
          let basketPrice = 0;
          for (var i = 0; i < response.products.length; i++) {
            basketPrice += response.products[i].price;
          }
          appObject.setState({
            basketContents: response.products,
            basketPrice,
            deliveryPrice: response.price
          })
        }
      })
      .catch(error => {
        console.log('Tókst ekki að ná í transaction details', error);
      })
  }

  onFormSubmit = (evt) => {
    evt.preventDefault();
  }

  handleInputFocus = ({ target }) => {
    this.setState({
      focused: target.name
    });
  };

  handleInputChange = ({ target }) => {
    if (target.name === 'number') {
      this.setState({
        number: target.value.replace(/ /g, '')
      });
    }
    else if (target.name === 'expiry') {
      this.setState({
        expiry: target.value.replace(/ |\//g, '')
      });
    }
    else {
      this.setState({
        [target.name]: target.value
      });
    }
  };

  handleConfirmClick = () => {
    // TODO ná í upplýsingar um sendandann út frá API lyklinum
    // TODO búa svo til sendinguna eftir að greiðslan fer í gegn
    toast("Greiðsla tókst og sending hefur verið búin til !", {type: "success"});
  }

  render() {
    const { number, name, expiry, cvc, focused } = this.state;
    return (
      <div className="container">
        <div className="paymentPageLeftSide">
          <div>
            <h3>Samantekt</h3>
          </div>
          <div className="flex-container-column costReview">
            <span>Vörur: {this.state.basketPrice} kr.</span>
            <span>Sendingarmáti: {this.state.deliveryPrice} kr.</span>
            <span>Samtals: {this.state.basketPrice + this.state.deliveryPrice} kr.</span>
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

export default PaymentPage;
