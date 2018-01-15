import React, { Component } from 'react';
import './deliveryOptions.css';

class DeliveryOptions extends Component {
  state = {
    deliveryOptions: [],
    selectedOption: {
      id: "",
      price: ""
    }
  }

  componentDidMount = () => {
    // TODO fyrst ná í api lykil út frá redirectkey og svo kalla í deliveryServicesAndPrices innan úr promise-inu
    const appObject = this;
    // fetch-a delivery services og prices nota api key: 1tljE4Hum+VSaOGTxhXioIhxQPPrZO06NroZruSZS7g=
    const postcode = this.props.match.params.postcode;
    const weight = this.props.match.params.weight;

    let url = `http://test-ws.epost.is:8989/wscm/deliveryservicesandprices?postCode=${postcode}&weight=${weight}`;

    let myHeaders = new Headers();
    myHeaders.set('x-api-key', '1tljE4Hum+VSaOGTxhXioIhxQPPrZO06NroZruSZS7g=');

    const myInit = {
                  'method': 'GET',
                  'headers': myHeaders
                };

    const request = new Request(url, myInit);

    fetch(request)
    .then(response => {
      return response.json();
    })
    .then(response => {
      console.log(response);
      appObject.setState({deliveryOptions: response.deliveryServicesAndPrices});
    })
    .catch(error => {
      console.log("Tókst ekki að ná í afhendingarleiðir og verð", error);
    });
  }

  onFormSubmit = (evt) => {
    evt.preventDefault();
    console.log('inní onFormSubmit');
    console.log(evt.target);
  }

  handleRadioButtons = (evt) => {
    console.log(evt.target.value);
    const selectedOption = evt.target.value;
    const deliveryOptions = this.state.deliveryOptions;
    for (var i = 0; i < deliveryOptions.length; i++) {
      if (selectedOption === deliveryOptions[i].deliveryServiceId) {
        this.setState({
          selectedOption: {
            id: selectedOption,
            price: deliveryOptions[i].priceRelated.bruttoPrice
          }
        })
      }
    }
  }

  render() {
    if (this.state.deliveryOptions.length) {

      const options = this.state.deliveryOptions.map((deliveryOption, i) =>
        <div key={i} className="flex-container-row justify-center">
          <input type="radio" id={i} value={deliveryOption.deliveryServiceId} name="option" onChange={this.handleRadioButtons}/>
          <label htmlFor={i} className="panel panel-default label80percent">
            <div className="panel-body">
              <div className="radioDiv flex-container-column col-md-1">
                <div>
                  {/*<i htmlFor="home" className="fa fa-circle-o fa-3x"></i>
                  <i htmlFor="home" className="fa fa-dot-circle-o fa-3x"></i>*/}
                </div>
              </div>
              <div className="descriptionDiv col-md-10">
                <h4>{deliveryOption.nameLong}</h4>
                <span>{deliveryOption.description}</span>
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
        <form className="container"  onSubmit={this.onFormSubmit}>
          {options}
          <input type="submit" value="Staðfesta og fara á greiðslusíðu"/>
        </form>
      )
    }
    return (
      <div className="container"></div>
    )
  }
}
export default DeliveryOptions;
