import React, { Component } from 'react';
import Field from './Field/Field.js';
import Validator from 'validator';
import './custInfo.css';

class CustInfo extends Component {
  state = {
    customer: {
      fullName: "",
      address: "",
      postcode: "",
      countryCode: "IS",
      email: "",
      phone: ""
    },
    inputErrors: {}
  }

  componentWillReceiveProps(update) {
    let fullName, address, postcode, countryCode, email, phone;
    update.customer.fullName === null ? fullName = "" : fullName = update.customer.fullName;
    update.customer.address === null ? address = "" : address = update.customer.address;
    update.customer.postcode === null ? postcode = "" : postcode = update.customer.postcode;
    update.customer.countryCode === null ? countryCode = "IS" : countryCode = update.customer.countryCode;
    update.customer.email === null ? email = "" : email = update.customer.email;
    update.customer.phone === null ? phone = "" : phone = update.customer.phone;

    this.setState({
      customer: {fullName, address, postcode, countryCode, email, phone}
    })
  }

  onInputChange = ({ name, value, error }) => {
    const customer = this.state.customer;
    const inputErrors = this.state.inputErrors;

    customer[name] = value;
    inputErrors[name] = error;

    this.setState({ customer, inputErrors });
  }

  onFormSubmit = (evt) => {
    evt.preventDefault();

    let url = `http://localhost:8989/wscm/landing/${this.props.redirectkey}/updateRecipient`;

    let myHeaders = new Headers();
    myHeaders.set("Content-Type", "application/json");

    const myInit = {
                    'method': 'POST',
                    'body': JSON.stringify(this.state.customer),
                    'headers': myHeaders
                  };

    const request = new Request(url, myInit);

    fetch(request)
    .then(response => {
      console.log(response);
      return response.status;
    })
    .then(response => {
      // If recipient details were updated successfully, then we continue and move on to the next step
      // TODO do some more stuff here, maybe add another param ('successful') to the onSubmit function, which App.js then handles.
      if (response === 200) {
        this.props.onSubmit(this.state.customer.postcode);
      }
    })
    .catch(error => {
      console.log("fetch unsuccessful, error: ");
      console.log(error);
    })
  };

  validate = () => {
    const customer = this.state.customer;
    const inputErrors = this.state.inputErrors;
    const errMessages = Object.keys(inputErrors).filter((k) => inputErrors[k]);
console.log("í form validate");
console.log(customer);
console.log(errMessages);
    if (!customer.fullName) return true;
    if (!customer.address) return true;
    if (!customer.postcode) return true;
    if (errMessages.length) {
      for (var i = 0; i < errMessages.length; i++) {
        if(errMessages[i] === 'email' || errMessages[i] === 'phone') continue;
        return true;
      }
    }

    return false;
  };

  render() {
    return (
      <div className="leftSide col-md-8">
        <h1>Upplýsingar um viðtakanda</h1>
        <form className="form" onSubmit={this.onFormSubmit}>
          <Field
          placeholder="Jón Jónsson"
          label='Fullt nafn'
          name="fullName"
          value={this.state.customer.fullName}
          onChange={this.onInputChange}
          required={true}
          validate={(val) => (val ? false : 'Vantar nafn')}
          />
          <br />
          <Field
          placeholder="Dúfnahólar 10"
          label="Heimilisfang"
          name="address"
          value={this.state.customer.address}
          onChange={this.onInputChange}
          required={true}
          validate={(val) => (val ? false : 'Vantar heimilisfang')}
          />
          <br />
          <Field
          placeholder="111"
          label="Póstnúmer"
          name="postcode"
          value={this.state.customer.postcode}
          onChange={this.onInputChange}
          required={true}
          validate={(val) => ((Validator.isNumeric(val) && val.length === 3 ) ? false : 'Póstnúmer eru 3 tölustafir')}
          />
          <br />
          <div>
            <label htmlFor="country">Land</label>
            <br />
            <input id="country" value="Ísland" readOnly/>
          </div>
          <br />
          <Field
          placeholder="jon@jonsson.is"
          label="Tölvupóstfang"
          name="email"
          value={this.state.customer.email}
          onChange={this.onInputChange}
          validate={(val) => (Validator.isEmail(val) ? false : 'Invalid Email')}
          />
          <br />
          <Field
          placeholder="5571234"
          label="Sími"
          name="phone"
          value={this.state.customer.phone}
          onChange={this.onInputChange}
          validate={(val) => ((Validator.isNumeric(val) && val.length < 8) ? false : 'Símanúmer eru 7 tölustafir')}
          />
          <span>* required</span>
          <br />
          <input type='submit' value="Áfram á næsta skref" disabled={this.validate()}/>
        </form>
      </div>
    );
  }
}

export default CustInfo;
