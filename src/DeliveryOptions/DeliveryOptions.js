import React, { Component } from 'react';
import './deliveryOptions.css';
import BasketContents from '../BasketContents/BasketContents.js';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { addDeliveryOptions, addDeliveryOptionsError, updateSelectedOption, addPostboxes, updateSelectedPostbox, changeFetchingDeliveryOptionsStatus } from '../actions/deliveryOptionsActions.js';
import DeliveryOption from './DeliveryOption/DeliveryOption.js';

class DeliveryOptions extends Component {

  componentDidMount = () => {
    const appObject = this;
    const countryCode = this.props.match.params.countryCode;
    const postcode = this.props.match.params.postcode;
    const weight = this.props.match.params.weight;

    let urlForDeliveryServicesAndPrices = `http://test-ws.epost.is:8989/wscm/deliveryservicesandprices?countryCode=${countryCode}&postCode=${postcode}&weight=${weight}`;

    let myHeaders = new Headers();
    myHeaders.set('x-api-key', this.props.apiKey);

    const myInit = {
                  'method': 'GET',
                  'headers': myHeaders
                };
    const request = new Request(urlForDeliveryServicesAndPrices, myInit);

    this.props.changeFetchingDeliveryOptionsStatus(true);

    fetch(request)
    .then(response => {
      return response.json();
    })
    .then(response => {
      if (response.deliveryServicesAndPrices.length) {
        for (var i = 0; i < response.deliveryServicesAndPrices.length; i++) {
          // fetch postboxes and populate the deliveryOptions.postboxes state property
          if (response.deliveryServicesAndPrices[i].deliveryServiceId === 'DPO') {
            const url = 'http://localhost:8989/wscm/postboxes';
            const request2 = new Request(url, myInit);
            fetch(request2)
            .then(response => {
              return response.json();
            })
            .then(response => {
              appObject.props.addPostboxes(response.postboxes);
            })
            .catch(error => {
              console.log("Ekki gekk að ná í póstbox", error);
            })
          }
        }
      }
      appObject.props.addDeliveryOptions(response.deliveryServicesAndPrices);
      this.props.changeFetchingDeliveryOptionsStatus(false);
    })
    .catch(error => {
      console.log("Tókst ekki að ná í afhendingarleiðir og verð", error);
    });

  }

  onFormSubmit = (evt) => {
    evt.preventDefault();

    // If the selected delivery option is 'Pakki Póstbox' but there is no postbox selected.
    if (this.props.selectedOption.id === 'DPO' && this.props.selectedPostbox === '') {
      this.props.addDeliveryOptionsError('Veldu póstbox.')
      return;
    }
    // If there is no delivery option selected.
    if (this.props.selectedOption.id === '') {
      this.props.addDeliveryOptionsError('Þú verður að velja afhendingarmáta.')
      return;
    }

    let url = `http://localhost:8989/wscm/landing/${this.props.match.params.redirectkey}/updateShippingOption`;

    let myHeaders = new Headers();
    myHeaders.set("Content-Type", "application/json");
    const myInit = {
                  'method': 'PUT',
                  'body': JSON.stringify(this.props.selectedOption),
                  'headers': myHeaders
                };

    const request = new Request(url, myInit);

    fetch(request)
    .then(response => {
      return response.status;
    })
    .then(response => {
      console.log(response);
      if (response === 200) {
        const location = {
          pathname: `/${this.props.match.params.redirectkey}/payment`
        }
        this.props.history.push(location);
      }
    })
  }

  handleRadioButtons = (evt) => {
    const selectedOption = evt.target.value;
    const deliveryOptions = this.props.deliveryOptions;
    for (var i = 0; i < deliveryOptions.length; i++) {
      if (selectedOption === deliveryOptions[i].deliveryServiceId) {
        this.props.updateSelectedOption( { id: selectedOption, price: deliveryOptions[i].priceRelated.bruttoPrice } );
        this.props.addDeliveryOptionsError( '' );
      }
    }
  }

  handleUpdateOfSelectedPostbox = (evt) => {
    this.props.updateSelectedPostbox(evt.target.value);
  }

  onBackButtonClick = () => {
    this.props.history.push(`/${this.props.match.params.redirectkey}`);
  }

  render() {
    if (this.props.fetchingDeliveryOptions) {
      return (
        <div className="deliveryOptionsContainer">
          <div className="deliveryOptionsLeftSide col-md-8">
            <div>
              <h2>
                Er að sækja afhendingarleiðir...
              </h2>
            </div>
            <div>
              <button className="btn" onClick={this.onBackButtonClick}>Til baka</button>
            </div>
          </div>
          <BasketContents className="col-md-4" basket={this.props.basket} totalPrice={this.props.totalPrice} totalWeight={this.props.totalWeight}/>
        </div>
      )
    }
    if (this.props.deliveryOptions.length) {
      const options = this.props.deliveryOptions.map((deliveryOption, i) => {
        let isChecked = deliveryOption.deliveryServiceId === this.props.selectedOption.id ? "checked" : "";
        if (deliveryOption.deliveryServiceId === 'DPO') {
          return <DeliveryOption key={i} id={i}
                    deliveryOption={deliveryOption}
                    postboxes={this.props.postboxes}
                    onChange={this.handleRadioButtons}
                    updateSelectedPostbox={this.handleUpdateOfSelectedPostbox}
                    selectedPostbox={this.props.selectedPostbox}
                    isChecked={isChecked}
                  />
        }
        return <DeliveryOption key={i} id={i} deliveryOption={deliveryOption} onChange={this.handleRadioButtons} isChecked={isChecked}/>
      });

      return (
        <div className="deliveryOptionsContainer">
          <form className="deliveryOptionsForm col-md-8"  onSubmit={this.onFormSubmit}>
            {options}
          {
            this.props.deliveryOptionsError !== '' ?
            <span className="deliveryOptionsErrorMessage">{this.props.deliveryOptionsError}</span> :
            <span></span>
          }
            <div className="flex-container-row deliveryOptionsButtons">
              <button className="btn deliveryOptionsBackButton" onClick={this.onBackButtonClick}>Til baka</button>
              <button type="submit" className="btn deliveryOptionsSubmitButton">Staðfesta og fara á greiðslusíðu</button>
            </div>
          </form>
          <BasketContents className="col-md-4" basket={this.props.basket} totalPrice={this.props.totalPrice} totalWeight={this.props.totalWeight}/>
        </div>
      )
    }
    return (
      <div className="deliveryOptionsContainer">
        <div className="deliveryOptionsLeftSide col-md-8">
          <div>
            <h2>
              Engar afhendingarleiðir fundust...
            </h2>
          </div>
          <div>
            <button className="btn" onClick={this.onBackButtonClick}>Til baka</button>
          </div>
        </div>
        <BasketContents className="col-md-4" basket={this.props.basket} totalPrice={this.props.totalPrice} totalWeight={this.props.totalWeight}/>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    apiKey: state.transactionDetails.apiKey,
    basket: state.transactionDetails.products,
    totalPrice: state.transactionDetails.productsPrice,
    totalWeight: state.transactionDetails.productsWeight,
    deliveryOptions: state.deliveryOptions.options,
    selectedOption: state.deliveryOptions.selectedOption,
    postboxes: state.deliveryOptions.postboxes,
    selectedPostbox: state.deliveryOptions.selectedPostbox,
    deliveryOptionsError: state.deliveryOptions.deliveryOptionsError,
    fetchingDeliveryOptions: state.deliveryOptions.fetchingDeliveryOptions
  }
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({
    addDeliveryOptions: addDeliveryOptions,
    updateSelectedOption: updateSelectedOption,
    addPostboxes: addPostboxes,
    updateSelectedPostbox: updateSelectedPostbox,
    addDeliveryOptionsError: addDeliveryOptionsError,
    changeFetchingDeliveryOptionsStatus: changeFetchingDeliveryOptionsStatus
  }, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(DeliveryOptions);
