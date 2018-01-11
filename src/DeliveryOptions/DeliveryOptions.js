import React, { Component } from 'react';
import './deliveryOptions.css';

class DeliveryOptions extends Component {
  state = {
    deliveryOptions: []
  }

  componentDidMount = () => {
    const appObject = this;
    // fetch-a delivery services og prices nota api key: 1tljE4Hum+VSaOGTxhXioIhxQPPrZO06NroZruSZS7g=
    let url = `http://test-ws.epost.is:8989/wscm/deliveryservicesandprices`;

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

  render() {
    if (this.state.deliveryOptions.length) {

      const options = this.state.deliveryOptions.map((deliveryOption, i) =>
        <div key={i} className="flex-container-row justify-center">
          <label htmlFor={i} className="panel panel-default label80percent">
            <div className="panel-body">
              <div className="radioDiv flex-container-column col-md-1">
                <div className="fa fa-circle-o fa-3x">
                  <input type="radio" id={i} value={deliveryOption.deliveryServiceId} name="option"/>
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
        <form className="container">
          {options}
          <input type="submit" value="Submit now" />
        </form>
      )
    }
    return (
      <div className="container"></div>
    )
  }
}
export default DeliveryOptions;
