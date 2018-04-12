import React, { Component } from 'react';
import Validator from 'validator';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Field from './Field/Field';
import addValidationError from '../actions/validationActions';
import { updateRecipientInfo, updateSelectedCountry } from '../actions/transactionActions';
import './RecipientInfo.css';

class RecipientInfo extends Component {
  onInputChange = ({ fieldName, value, error }) => {
    this.props.addValidationError({ fieldName, error }); // Not the best name for this function.. It simply either updates with 'false' or the error message itself, regardless of what it was before.
    this.props.updateRecipientInfo({ fieldName, value });
  }

  onCountryChange = (evt) => {
    const [fieldName, value] = [evt.target.name, evt.target.value];
    const error = value ? false : 'Veldu land';

    this.onInputChange({ fieldName, value, error });
    this.props.updateSelectedCountry(evt.target.value);
  }

  onFormSubmit = (evt) => {
    evt.preventDefault();

    const url = `http://localhost:3001/api/updateRecipient/${this.props.redirectkey}`;

    const myHeaders = new Headers();
    myHeaders.set('Content-Type', 'application/json');

    const myInit = {
      method: 'PUT',
      body: JSON.stringify(this.props.recipient),
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
    const recipient = this.props.recipient;
    if (!recipient.fullName) return true;
    if (!recipient.address) return true;
    if (!recipient.postcode) return true;
  //  if (this.props.selectedCountry === '' || this.props.selectedCountry === null) return true;
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
    // TODO: Uncomment to populate the country selection element when we allow international shipments.
    // let countries = [];
    // if (this.props.countries) {
    //   countries = this.props.countries.map((country, i) => {
    //     return (
    //       <option key={i} value={country.countryCode}>{country.nameShort}</option>
    //     );
    //   });
    // }

    return (
      <div className="leftSide col-md-8">
        <h1>Upplýsingar um viðtakanda</h1>
        <form className="recipientForm" onSubmit={this.onFormSubmit}>
          <Field
            placeholder="t.d. Jón Jónsson"
            label='Fullt nafn'
            name="fullName"
            value={this.props.recipient.fullName}
            onChange={this.onInputChange}
            errorState={this.props.inputErrors.fullName}
            required
            validate={(val) => (val ? false : 'Vantar nafn')}
          />
          <br />
          <Field
            placeholder="t.d. Dúfnahólar 10"
            label="Heimilisfang"
            name="address"
            value={this.props.recipient.address}
            onChange={this.onInputChange}
            errorState={this.props.inputErrors.address}
            required
            validate={val => (val ? false : 'Vantar heimilisfang')}
          />
          <br />
          <Field
            placeholder="t.d. 111"
            label="Póstnúmer"
            name="postcode"
            value={this.props.recipient.postcode}
            onChange={this.onInputChange}
            errorState={this.props.inputErrors.postcode}
            required
            validate={val => ((Validator.isNumeric(val) && val.length === 3 ) ? false : 'Póstnúmer eru 3 tölustafir')}
          />
          <br />
        { /*  <div>
            <label htmlFor="country">Land</label>
            <span className="redAsterix"> *</span>
            <br />
            <select name="countryCode" id="country" onChange={this.onCountryChange} value={this.props.selectedCountry}>
              <option value="">Veldu land</option>
              <option value="IS">Ísland</option>
              TODO: uncommenta línuna fyrir neðan ef við bætum við sendingum til útlanda
              {countries}
            </select>
            <br />
            <span style={{ color: 'red' }}>{ this.props.inputErrors.countryCode }</span>
          </div>
          <br /> */ }
          <div className="recipientContactDetails">Upplýsingar um stöðu sendingar verða sendar á tiltekið tölvupóstfang og/eða í farsíma</div>
          <Field
            placeholder="t.d. jon@island.is"
            label="Tölvupóstfang"
            name="email"
            value={this.props.recipient.email}
            onChange={this.onInputChange}
            errorState={this.props.inputErrors.email}
            validate={(val) => {
              if (val.length === 0) {
                return false;
              }
              if (Validator.isEmail(val)) {
                return false;
              }
              return 'Ekki á réttu formi';
            }
          }
          />
          <br />
          <Field
            placeholder="t.d. 8671234"
            label="Farsími"
            name="phone"
            value={this.props.recipient.phone}
            onChange={this.onInputChange}
            errorState={this.props.inputErrors.phone}
            validate={(val) => {
              // Check if input is empty. If so, all is good.
              if (val.length === 0) {
                return false;
              }
              // Check if input consists only of numbers and doesn't exceed 7 digits.
              if (Validator.isNumeric(val) && val.length < 8) {
                // Check if input is a legit mobile phone number.
                if (val.substr(0, 1) !== '6' && val.substr(0, 1) !== '7' && val.substr(0, 1) !== '8') {
                  return 'Farsímar byrja á 6, 7 eða 8';
                }
                return false;
              }
              return 'Símanúmer eru 7 tölustafir';
            }
          }
          />
          <span className="redAsterix">*</span><span>Nauðsynlegt að fylla út</span>
          <br />
          <input className="btn text-uppercase" type="submit" value="Áfram á næsta skref" disabled={this.validate()} />
        </form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    inputErrors: state.recipientInfoValidation.inputErrors,
    products: state.transactionDetails.products,
    selectedCountry: state.transactionDetails.recipientInfo.countryCode,
  };
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({
    addValidationError,
    updateRecipientInfo,
    updateSelectedCountry,
  }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(RecipientInfo);
