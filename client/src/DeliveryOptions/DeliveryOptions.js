import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { addDeliveryOptions, addDeliveryOptionsError, updateSelectedOption, addPostboxes, updateSelectedPostbox, changeFetchingDeliveryOptionsStatus } from '../actions/deliveryOptionsActions';
import './deliveryOptions.css';
import BasketContents from '../BasketContents/BasketContents';
import DeliveryOption from './DeliveryOption/DeliveryOption';

class DeliveryOptions extends Component {
  componentDidMount = () => {
    if (this.props.created) {
      return;
    }
    const deliveryOptionsObject = this;
    // const countryCode = this.props.selectedCountry;
    // const postcode = this.props.customer.postcode;
    // const weight = this.props.totalWeight;
    const [countryCode, postcode, weight] = [this.props.selectedCountry, this.props.customer.postcode, this.props.totalWeight];

    const url = `http://localhost:3001/api/getDeliveryPrices/${this.props.match.params.redirectkey}/${countryCode}/${postcode}/${weight}`;

    this.props.changeFetchingDeliveryOptionsStatus(true);

    fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        if (response.deliveryServicesAndPrices.length) {
          for (let i = 0; i < response.deliveryServicesAndPrices.length; i++) {
            // fetch postboxes and populate the deliveryOptions.postboxes state property
            if (response.deliveryServicesAndPrices[i].deliveryServiceId === 'DPO') {
              fetch(`http://localhost:3001/api/getPostboxes/${this.props.match.params.redirectkey}`)
                .then((response2) => {
                  return response2.json();
                })
                .then((response3) => {
                  deliveryOptionsObject.props.addPostboxes(response3.postboxes);
                })
                .catch((error) => {
                  console.log('Ekki gekk að ná í póstbox', error);
                });
            }
          }
        }
        deliveryOptionsObject.props.addDeliveryOptions(response.deliveryServicesAndPrices);
        this.props.changeFetchingDeliveryOptionsStatus(false);
      })
      .catch((error) => {
        console.log('Tókst ekki að ná í afhendingarleiðir og verð', error);
      });
  }

  onFormSubmit = (evt) => {
    evt.preventDefault();

    // If the selected delivery option is 'Pakki Póstbox' but there is no postbox selected.
    if (this.props.selectedOption.id === 'DPO' && this.props.selectedPostbox === '') {
      this.props.addDeliveryOptionsError('Veldu póstbox.');
      return;
    }
    // If there is no delivery option selected.
    if (this.props.selectedOption.id === '') {
      this.props.addDeliveryOptionsError('Þú verður að velja afhendingarmáta.');
      return;
    }

    const url = `http://localhost:8989/wscm/landing/${this.props.match.params.redirectkey}/updateShippingOption`;

    const myHeaders = new Headers();
    myHeaders.set('Content-Type', 'application/json');
    const myInit = {
      method: 'PUT',
      body: JSON.stringify(this.props.selectedOption),
      headers: myHeaders,
    };

    const request = new Request(url, myInit);

    fetch(request)
      .then((response) => {
        return response.status;
      })
      .then((response) => {
        if (response === 200) {
          const location = {
            pathname: `/${this.props.match.params.redirectkey}/payment`,
          };
          this.props.history.push(location);
        }
      });
  }

  handleUpdateOfSelectedPostbox = (evt) => {
    this.props.updateSelectedPostbox(evt.target.value);
    this.props.addDeliveryOptionsError('');
  }

  handleRadioButtons = (evt) => {
    const selectedOption = evt.target.value;
    const deliveryOptions = this.props.deliveryOptions;
    for (let i = 0; i < deliveryOptions.length; i++) {
      if (selectedOption === deliveryOptions[i].deliveryServiceId) {
        this.props.updateSelectedOption({ id: selectedOption, price: deliveryOptions[i].priceRelated.bruttoPrice });
        this.props.addDeliveryOptionsError('');
      }
    }
  }
  render() {
    if (this.props.created) {
      return (
        <div className="container">
          <main className="flex-container-row justify-center">
            <h2>Sending hefur nú þegar verið búin til.</h2>
          </main>
        </div>
      );
    }

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
              <Link to={"/"+this.props.match.params.redirectkey}><button className="btn deliveryOptionsBackButton">Til baka</button></Link>
            </div>
          </div>
          <BasketContents className="col-md-4" basket={this.props.basket} totalPrice={this.props.totalPrice} totalWeight={this.props.totalWeight} />
        </div>
      );
    }

    if (this.props.deliveryOptions.length) {
      const options = this.props.deliveryOptions.map((deliveryOption, i) => {
        const isChecked = deliveryOption.deliveryServiceId === this.props.selectedOption.id ? 'checked' : '';
        if (deliveryOption.deliveryServiceId === 'DPO') {
          return (
            <DeliveryOption key={i}
              id={i}
              deliveryOption={deliveryOption}
              postboxes={this.props.postboxes}
              onChange={this.handleRadioButtons}
              updateSelectedPostbox={this.handleUpdateOfSelectedPostbox}
              selectedPostbox={this.props.selectedPostbox}
              isChecked={isChecked}
            />
          );
        }
        return <DeliveryOption key={i} id={i} deliveryOption={deliveryOption} onChange={this.handleRadioButtons} isChecked={isChecked} />;
      });

      return (
        <div className="deliveryOptionsContainer">
          <form className="deliveryOptionsForm col-md-8" onSubmit={this.onFormSubmit}>
            {options}
            {
              this.props.deliveryOptionsError !== '' ?
                <span className="deliveryOptionsErrorMessage">{this.props.deliveryOptionsError}</span> :
                <span></span>
            }
            <div className="flex-container-row deliveryOptionsButtons">
              <Link to={"/"+this.props.match.params.redirectkey}><button className="btn deliveryOptionsBackButton">Til baka</button></Link>
              <button type="submit" className="btn deliveryOptionsSubmitButton">Staðfesta og fara á greiðslusíðu</button>
            </div>
          </form>
          <BasketContents className="col-md-4" basket={this.props.basket} totalPrice={this.props.totalPrice} totalWeight={this.props.totalWeight} />
        </div>
      );
    }

    return (
      <div className="deliveryOptionsContainer">
        <div className="deliveryOptionsLeftSide col-md-8">
          <div>
            <h2>
              Engar afhendingarleiðir fundust...
            </h2>
          </div>
          <div className="flex-container-row deliveryOptionsButtons">
            <Link to={"/"+this.props.match.params.redirectkey}><button className="btn deliveryOptionsBackButton">Til baka</button></Link>
          </div>
        </div>
        <BasketContents className="col-md-4" basket={this.props.basket} totalPrice={this.props.totalPrice} totalWeight={this.props.totalWeight} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    apiKey: state.transactionDetails.apiKey,
    basket: state.transactionDetails.products,
    customer: state.transactionDetails.customerInfo,
    totalPrice: state.transactionDetails.productsPrice,
    totalWeight: state.transactionDetails.productsWeight,
    deliveryOptions: state.deliveryOptions.options,
    selectedOption: state.deliveryOptions.selectedOption,
    postboxes: state.deliveryOptions.postboxes,
    selectedPostbox: state.deliveryOptions.selectedPostbox,
    deliveryOptionsError: state.deliveryOptions.deliveryOptionsError,
    fetchingDeliveryOptions: state.deliveryOptions.fetchingDeliveryOptions,
    selectedCountry: state.deliveryOptions.selectedCountry,
    created: state.transactionDetails.created,
  };
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({
    addDeliveryOptions,
    updateSelectedOption,
    addPostboxes,
    updateSelectedPostbox,
    addDeliveryOptionsError,
    changeFetchingDeliveryOptionsStatus,
  }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(DeliveryOptions);
