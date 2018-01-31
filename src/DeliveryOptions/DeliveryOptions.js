import React, { Component } from 'react';
import './deliveryOptions.css';
import BasketContents from '../BasketContents/BasketContents.js';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { addDeliveryOptions, updateSelectedOption, addPostboxes, updateSelectedPostbox } from '../actions/deliveryOptionsActions.js';
import DeliveryOption from './DeliveryOption/DeliveryOption.js';

class DeliveryOptions extends Component {

  componentDidMount = () => {
    const appObject = this;

    const postcode = this.props.match.params.postcode;
    const weight = this.props.match.params.weight;

    let urlForDeliveryServicesAndPrices = `http://test-ws.epost.is:8989/wscm/deliveryservicesandprices?postCode=${postcode}&weight=${weight}`;

    let myHeaders = new Headers();
    myHeaders.set('x-api-key', this.props.apiKey);

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
    })
    .catch(error => {
      console.log("Tókst ekki að ná í afhendingarleiðir og verð", error);
    });

  }

  onFormSubmit = (evt) => {
    evt.preventDefault();

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
      }
    }
  }

  handleUpdateOfSelectedPostbox = (evt) => {
    this.props.updateSelectedPostbox(evt.target.value);
  }

  render() {
    if (this.props.deliveryOptions.length) {
      const options = this.props.deliveryOptions.map((deliveryOption, i) => {
        if (deliveryOption.deliveryServiceId === 'DPO') {
          return <DeliveryOption key={i} id={i}
                    deliveryOption={deliveryOption}
                    postboxes={this.props.postboxes}
                    onChange={this.handleRadioButtons}
                    updateSelectedPostbox={this.handleUpdateOfSelectedPostbox}
                  />
        }
        return <DeliveryOption key={i} id={i} deliveryOption={deliveryOption} onChange={this.handleRadioButtons}/>
      });

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
    apiKey: state.transactionDetails.apiKey,
    basket: state.transactionDetails.products,
    totalPrice: state.transactionDetails.productsPrice,
    totalWeight: state.transactionDetails.productsWeight,
    deliveryOptions: state.deliveryOptions.options,
    selectedOption: state.deliveryOptions.selectedOption,
    postboxes: state.deliveryOptions.postboxes
  }
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({
    addDeliveryOptions: addDeliveryOptions,
    updateSelectedOption: updateSelectedOption,
    addPostboxes: addPostboxes,
    updateSelectedPostbox: updateSelectedPostbox
  }, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(DeliveryOptions);
