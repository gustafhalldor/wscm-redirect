import React, { Component } from 'react';
import './deliveryOptions.css';
import BasketContents from '../BasketContents/BasketContents.js';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { addDeliveryOptions, updateSelectedOption } from '../actions/deliveryOptionsActions.js';

class DeliveryOptions extends Component {

  componentDidMount = () => {
    // TODO fyrst ná í api lykil út frá redirectkey og svo kalla í deliveryServicesAndPrices innan úr promise-inu
    const appObject = this;
    // fetch-a delivery services og prices nota api key: 1tljE4Hum+VSaOGTxhXioIhxQPPrZO06NroZruSZS7g=
    const postcode = this.props.match.params.postcode;
    const weight = this.props.match.params.weight;

    let urlForDeliveryServicesAndPrices = `http://test-ws.epost.is:8989/wscm/deliveryservicesandprices?postCode=${postcode}&weight=${weight}`;
    let urlForObtainingApiKey = `http://localhost:8989/wscm/landing/${this.props.match.params.redirectkey}/apiKey`;

    fetch(urlForObtainingApiKey)
    .then(response => {
      return response.json();
    })
    .then(response => {
      let myHeaders = new Headers();
      myHeaders.set('x-api-key', response.key);

      const myInit = {
                    'method': 'GET',
                    'headers': myHeaders
                  };
      const request = new Request(urlForDeliveryServicesAndPrices, myInit);

      fetch(request)
      .then(response => {
        return response.json();
      })
      .then(response => {
        console.log(response);
        appObject.props.addDeliveryOptions(response.deliveryServicesAndPrices);
      })
      .catch(error => {
        console.log("Tókst ekki að ná í afhendingarleiðir og verð", error);
      });
    })
    .catch(error => {
      console.log("Tókst ekki að ná í API lykil");
    })
  }

  onFormSubmit = (evt) => {
    evt.preventDefault();
    console.log('inní onFormSubmit');

    //TODO vista val í db og svo fara yfir á greiðslusíðu ef það Tókst

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
    console.log(evt.target.value);
    const selectedOption = evt.target.value;
    const deliveryOptions = this.props.deliveryOptions;
    for (var i = 0; i < deliveryOptions.length; i++) {
      if (selectedOption === deliveryOptions[i].deliveryServiceId) {
        this.props.updateSelectedOption( { id: selectedOption, price: deliveryOptions[i].priceRelated.bruttoPrice } );
      }
    }
  }

  render() {
    console.log(this.props);
    if (this.props.deliveryOptions.length) {

      const options = this.props.deliveryOptions.map((deliveryOption, i) =>
        <div key={i} className="flex-container-row justify-center">
          <input type="radio" id={i} value={deliveryOption.deliveryServiceId} name="option" onChange={this.handleRadioButtons} className="input-hidden"/>
          <label htmlFor={i} className="wscm-radio-panel panel panel-default label80percent">
            <div className="panel-body">
              <div className="radioDiv flex-container-column col-md-1">
                <div>
                  <i htmlFor="home" className="fa fa-circle-o fa-3x"></i>
                  <i htmlFor="home" className="fa fa-dot-circle-o fa-3x"></i>
                </div>
              </div>
              <div className="descriptionDiv col-md-10">
                <h4>{deliveryOption.nameLong}</h4>
                {
                  deliveryOption.storeLocations ?
                  <span>{deliveryOption.storeLocations[0].name} - {deliveryOption.storeLocations[0].address}</span> :
                  <span>{deliveryOption.description}</span>
                }
              </div>
              <div className="priceDiv col-md-1">
                <h4>Verð</h4>
                <span>{deliveryOption.priceRelated.bruttoPrice}</span>
              </div>
            </div>
          </label>
        </div>
      );

      return (
        <div className="deliveryOptionsContainer">
          <form className="deliveryOptionsForm col-md-8"  onSubmit={this.onFormSubmit}>
            {options}
          {/*TODO búa til Til baka hnapp*/}
            <button type="submit" className="deliveryOptionsButton btn">Staðfesta og fara á greiðslusíðu</button>
          </form>
          <BasketContents className="col-md-4" basket={this.props.basket} totalPrice={this.props.totalPrice} totalWeight={this.props.totalWeight}/>
        </div>
      )
    }
    return (
      <div className="container"></div>
    )
  }
}

function mapStateToProps(state) {
  return {
    basket: state.transactionDetails.products,
    totalPrice: state.transactionDetails.productsPrice,
    totalWeight: state.transactionDetails.productsWeight,
    deliveryOptions: state.deliveryOptions.options,
    selectedOption: state.deliveryOptions.selectedOption
  }
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({
    addDeliveryOptions: addDeliveryOptions,
    updateSelectedOption: updateSelectedOption
  }, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(DeliveryOptions);
