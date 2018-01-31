import React, { Component } from 'react';

class DeliveryOption extends Component {

  render() {
    // If the delivery service is 'Pakki Póstbox' then populate the select element with the postboxes.
    let postboxes = [];
    if (this.props.deliveryOption.deliveryServiceId === 'DPO') {
      // get postboxes from state and map each one to an <option> element
      postboxes = this.props.postboxes.map((postbox, i) => {
        return <option key={i} value={postbox.name}>{postbox.name}</option>
      })
    }

    return (
      <div className="flex-container-row justify-center">
        <input type="radio" id={this.props.id} value={this.props.deliveryOption.deliveryServiceId} name="option" onChange={this.props.onChange} className="input-hidden"/>
        <label htmlFor={this.props.id} className="wscm-radio-panel panel panel-default label80percent">
          <div className="panel-body">
            <div className="radioDiv flex-container-column col-md-1">
              <div>
                <i htmlFor="home" className="fa fa-circle-o fa-3x"></i>
                <i htmlFor="home" className="fa fa-dot-circle-o fa-3x"></i>
              </div>
            </div>
            <div className="flex-container-column col-md-10">
              <h4>{this.props.deliveryOption.nameLong}</h4>
              {
                this.props.deliveryOption.storeLocations ?
                <span>{this.props.deliveryOption.storeLocations[0].name} - {this.props.deliveryOption.storeLocations[0].address}</span> :
                <span>{this.props.deliveryOption.description}</span>
              }
              {
                this.props.deliveryOption.deliveryServiceId === 'DPO' &&
                <div>
                  <span>Veldu póstbox: </span>
                  <select name="selectPostbox" id="selectPostbox" onChange={this.props.updateSelectedPostbox}>{postboxes}</select>
                </div>
              }
            </div>
            <div className="priceDiv col-md-1">
              <h4>Verð</h4>
              <span>{this.props.deliveryOption.priceRelated.bruttoPrice}</span>
            </div>
          </div>
        </label>
      </div>
    )
  }
}

export default DeliveryOption;
