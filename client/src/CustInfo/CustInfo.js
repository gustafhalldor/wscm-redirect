import React, { Component } from 'react';
import Validator from 'validator';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Field from './Field/Field';
import addValidationError from '../actions/validationActions';
import { updateCustomerInfo } from '../actions/transactionActions';
import { updateSelectedCountry } from '../actions/deliveryOptionsActions';
import './custInfo.css';

class CustInfo extends Component {
  onInputChange = ({ fieldName, value, error }) => {
    this.props.addValidationError({ fieldName, error }); // Not the best name for this function.. It simply either updates with 'false' or the error message itself, regardless of what it was before.
    this.props.updateCustomerInfo({ fieldName, value });
  }

  onCountryChange = (evt) => {
    const [fieldName, value] = [evt.target.name, evt.target.value];
    const error = value ? false : 'Veldu land';

    this.onInputChange({ fieldName, value, error });
    this.props.updateSelectedCountry(evt.target.value);
  }

  onFormSubmit = (evt) => {
    evt.preventDefault();

    const url = `http://localhost:8989/wscm/landing/${this.props.redirectkey}/updateRecipient`;

    const myHeaders = new Headers();
    myHeaders.set('Content-Type', 'application/json');

    const myInit = {
      method: 'PUT',
      body: JSON.stringify(this.props.customer),
      headers: myHeaders,
    };

    const request = new Request(url, myInit);

    fetch(request)
      .then((response) => {
        return response.status;
      })
      .then((response) => {
        // If recipient details were updated successfully, then we continue and move on to the next step
        // TODO do some more stuff here, maybe add another param ('successful') to the onSubmit function, which App.js then handles.
        if ((response) === 200) {
          this.props.onSubmit();
        }
      })
      .catch((error) => {
        console.log('fetch unsuccessful, error: ');
        console.log(error);
      });
  };

  validate = () => {
    const customer = this.props.customer;
    if (!customer.fullName) return true;
    if (!customer.address) return true;
    if (!customer.postcode) return true;
    if (this.props.selectedCountry === '' || this.props.selectedCountry === null) return true;
    if (!this.props.products.length) return true;

    const inputErrors = this.props.inputErrors;
    const errMessages = Object.keys(inputErrors).filter(k => inputErrors[k]);
    if (errMessages.length) {
      for (let i = 0; i < errMessages.length; i++) {
        if (errMessages[i] === 'email' || errMessages[i] === 'phone') continue;
        return true;
      }
    }

    return false;
  };

  render() {
    // Populate the country selection element.
    let countries = [];
    if (this.props.countries) {
      countries = this.props.countries.map((country, i) => {
        return (
          <option key={i} value={country.countryCode}>{country.nameShort}</option>
        );
      });
    }

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
            errorState={this.props.inputErrors.fullName}
            required
            validate={(val) => (val ? false : 'Vantar nafn')}
          />
          <br />
          <Field
            placeholder="Dúfnahólar 10"
            label="Heimilisfang"
            name="address"
            value={this.props.customer.address}
            onChange={this.onInputChange}
            errorState={this.props.inputErrors.address}
            required
            validate={val => (val ? false : 'Vantar heimilisfang')}
          />
          <br />
          <Field
            placeholder="111"
            label="Póstnúmer"
            name="postcode"
            value={this.props.customer.postcode}
            onChange={this.onInputChange}
            errorState={this.props.inputErrors.postcode}
            required
            validate={val => ((Validator.isNumeric(val) && val.length === 3 ) ? false : 'Póstnúmer eru 3 tölustafir')}
          />
          <br />
          <div>
            <label htmlFor="country">Land</label>
            <span className="redAsterix"> *</span>
            <br />
            <select name="countryCode" id="country" onChange={this.onCountryChange} value={this.props.selectedCountry}>
              <option value="">Veldu land</option>
              <option value="IS">Ísland</option>
              {countries}
            </select>
            <br />
            <span style={{ color: 'red' }}>{ this.props.inputErrors.countryCode }</span>
          </div>
          <br />
          <Field
            placeholder="jon@jonsson.is"
            label="Tölvupóstfang"
            name="email"
            value={this.props.customer.email}
            onChange={this.onInputChange}
            errorState={this.props.inputErrors.email}
            validate={(val) => (Validator.isEmail(val) ? false : 'Invalid Email')}
          />
          <br />
          <Field
            placeholder="8671234"
            label="Farsími"
            name="phone"
            value={this.props.customer.phone}
            onChange={this.onInputChange}
            errorState={this.props.inputErrors.phone}
            validate={val => ((Validator.isNumeric(val) && val.length < 8) ? false : 'Símanúmer eru 7 tölustafir')}
          />
          <span className="redAsterix">*</span><span>Nauðsynlegt að fylla út</span>
          <br />
          <input type="submit" value="Áfram á næsta skref" disabled={this.validate()} />
        </form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    inputErrors: state.customerInfoValidation.inputErrors,
    products: state.transactionDetails.products,
  };
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({
    addValidationError,
    updateCustomerInfo,
    updateSelectedCountry,
  }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(CustInfo);