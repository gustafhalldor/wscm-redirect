import React, { Component } from 'react';
import Field from './Field/Field.js';
import Validator from 'validator';
import './custInfo.css';

class CustInfo extends Component {
  state = {
    inputErrors: {}
  }

  onInputChange = ({ name, value, error }) => {
    const customer = this.props.customer;
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
                    'method': 'PUT',
                    'body': JSON.stringify(this.props.customer),
                    'headers': myHeaders
                  };

    const request = new Request(url, myInit);

    fetch(request)
    .then(response => {
      return response.status;
    })
    .then(response => {
      // If recipient details were updated successfully, then we continue and move on to the next step
      // TODO do some more stuff here, maybe add another param ('successful') to the onSubmit function, which App.js then handles.
      if (response === 200) {
        this.props.onSubmit();
      }
    })
    .catch(error => {
      console.log("fetch unsuccessful, error: ");
      console.log(error);
    })
  };

  validate = () => {
    const customer = this.props.customer;
    const inputErrors = this.state.inputErrors;
    const errMessages = Object.keys(inputErrors).filter((k) => inputErrors[k]);
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
    // Populate the country selection element.
    let countries = this.props.countries.map((country, i) => {
      return (
        <option key={i} value={country.countryCode}>{country.nameShort}</option>
      )
    })

    return (
      <div className="leftSide col-md-8">
        <h1>Upplýsingar um viðtakanda</h1>
        <form className="customerForm" onSubmit={this.onFormSubmit}>
          <Field
          placeholder="Jón Jónsson"
          label='Fullt nafn'
          name="fullName"
          value={this.props.customer.fullName}
          onChange={this.onInputChange}
          required={true}
          validate={(val) => (val ? false : 'Vantar nafn')}
          />
          <br />
          <Field
          placeholder="Dúfnahólar 10"
          label="Heimilisfang"
          name="address"
          value={this.props.customer.address}
          onChange={this.onInputChange}
          required={true}
          validate={(val) => (val ? false : 'Vantar heimilisfang')}
          />
          <br />
          <Field
          placeholder="111"
          label="Póstnúmer"
          name="postcode"
          value={this.props.customer.postcode}
          onChange={this.onInputChange}
          required={true}
          validate={(val) => ((Validator.isNumeric(val) && val.length === 3 ) ? false : 'Póstnúmer eru 3 tölustafir')}
          />
          <br />
          <div>
            <label htmlFor="country">Land</label>
            <br />
            <select name="countySelect" id="country" onChange={this.props.onCountryChange}>
              <option value="">.....</option>
              <option value="IS">Ísland</option>
              {countries}
            </select>
          </div>
          <br />
          <Field
          placeholder="jon@jonsson.is"
          label="Tölvupóstfang"
          name="email"
          value={this.props.customer.email}
          onChange={this.onInputChange}
          validate={(val) => (Validator.isEmail(val) ? false : 'Invalid Email')}
          />
          <br />
          <Field
          placeholder="5571234"
          label="Sími"
          name="phone"
          value={this.props.customer.phone}
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
