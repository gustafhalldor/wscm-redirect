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
      countryCode: "",
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
    update.customer.countryCode === null ? countryCode = "" : countryCode = update.customer.countryCode;
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
    console.log("kallað í onFormSubmit");
    console.log(this.state.customer);
    this.props.onSubmit();
  };

  validate = () => {
    const customer = this.state.customer;
    const inputErrors = this.state.inputErrors;
    const errMessages = Object.keys(inputErrors).filter((k) => inputErrors[k]);
console.log("í form validate");
console.log(customer);
console.log(errMessages);
    if (!customer.fullName) return true;
    if (!customer.email) return true;
    if (errMessages.length) return true;

    return false;
  };

  render() {
    return (
      <div className="leftSide col-md-6">
        <h1>Upplýsingar um viðtakanda</h1>
        <form className="form" onSubmit={this.onFormSubmit}>
          <Field
          placeholder="Nafn"
          name="fullName"
          value={this.state.customer.fullName}
          onChange={this.onInputChange}
          required={true}
          validate={(val) => (val ? false : 'Vantar nafn')}
          />
          <br />
          <Field
          placeholder="Heimilisfang"
          name="address"
          value={this.state.customer.address}
          onChange={this.onInputChange}
          required={true}
          />
          <br />
          <Field
          placeholder="Póstnúmer"
          name="postcode"
          value={this.state.customer.postcode}
          onChange={this.onInputChange}
          required={true}
          validate={(val) => ((Validator.isNumeric(val) && val.length < 4 ) ? false : 'Póstnúmer eru 3 tölustafir')}
          />
          <br />
          {/*<Field
          placeholder="Land"
          name="country"
          value={this.state.customer.country}
          onChange={this.onInputChange}
          required={true}
          />
          <br />*/}
          <Field
          placeholder="Email"
          name="email"
          value={this.state.customer.email}
          onChange={this.onInputChange}
          validate={(val) => (Validator.isEmail(val) ? false : 'Invalid Email')}
          />
          <br />
          <Field
          placeholder="Símanúmer"
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
