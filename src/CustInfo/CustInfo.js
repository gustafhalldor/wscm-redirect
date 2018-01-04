import React, { Component } from 'react';
import Field from './Field/Field.js';
import './custInfo.css';

class CustInfo extends Component {
  state = {
    customer: {
      fullName: "",
      address: "",
      postcode: "",
      country: "",
      email: "",
      phone: ""
    }
  }

  componentWillReceiveProps(update) {
    let fullName, address, postcode, country, email, phone;
    update.customer.fullName === null ? fullName = "" : fullName = update.customer.fullName;
    update.customer.address === null ? address = "" : address = update.customer.address;
    update.customer.postcode === null ? postcode = "" : postcode = update.customer.postcode;
    update.customer.country === null ? country = "" : country = update.customer.country;
    update.customer.email === null ? email = "" : email = update.customer.email;
    update.customer.phone === null ? phone = "" : phone = update.customer.phone;

    this.setState({
      customer: {fullName, address, postcode, country, email, phone}
    })
  }

  onInputChange = ({ name, value, error }) => {
    const customer = this.state.customer;
    customer[name] = value;
    this.setState({ customer });
  }

  onFormSubmit = (evt) => {
    evt.preventDefault();
    console.log("kallað í onFormSubmit");
    console.log(this.state.customer);
  };

  render() {
    return (
      <div className="leftSide col-md-6">
        <h1>Upplýsingar um viðtakanda</h1>
        <form onSubmit={this.onFormSubmit}>
          <Field
          placeholder="Nafn"
          name="fullName"
          value={this.state.customer.fullName}
          onChange={this.onInputChange}
          />
          <br />
          <Field
          placeholder="Heimilisfang"
          name="address"
          value={this.state.customer.address}
          onChange={this.onInputChange}
          />
          <br />
          <Field
          placeholder="Póstnúmer"
          name="postcode"
          value={this.state.customer.postcode}
          onChange={this.onInputChange}
          />
          <br />
          <Field
          placeholder="Land"
          name="country"
          value={this.state.customer.country}
          onChange={this.onInputChange}
          />
          <br />
          <Field
          placeholder="Email"
          name="email"
          value={this.state.customer.email}
          onChange={this.onInputChange}
          />
          <br />
          <Field
          placeholder="Símanúmer"
          name="phone"
          value={this.state.customer.phone}
          onChange={this.onInputChange}
          />
          <br />
          <input type='submit' value="Áfram á næsta skref"/>
        </form>
      </div>
    );
  }
}

export default CustInfo;
