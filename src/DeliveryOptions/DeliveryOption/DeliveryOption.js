import React from 'react';

const DeliveryOption = (props) => {
  // If the delivery service is 'Pakki Póstbox' then populate the select element with the postboxes.
  let postboxes = [];
  if (props.deliveryOption.deliveryServiceId === 'DPO') {
    // get postboxes from state and map each one to an <option> element
    postboxes = props.postboxes.map((postbox, i) => {
      return <option key={i} value={postbox.name}>{postbox.name}</option>;
    });
  }

  return (
    <div className="flex-container-row justify-center">
      <input type="radio" id={props.id} value={props.deliveryOption.deliveryServiceId} name="option" onChange={props.onChange} className="input-hidden" checked={props.isChecked} />
      <label htmlFor={props.id} className="wscm-radio-panel panel panel-default label80percent">
        <div className="panel-body flex-container-row align-items-center">
          <div className="radioDiv col-md-1">
            <div>
              <i htmlFor="home" className="fa fa-circle-o fa-3x" />
              <i htmlFor="home" className="fa fa-dot-circle-o fa-3x" />
            </div>
          </div>
          <div className="flex-container-column col-md-10">
            <h4>{props.deliveryOption.nameLong}</h4>
            {
              props.deliveryOption.storeLocations ?
                <span>{props.deliveryOption.storeLocations[0].name} - {props.deliveryOption.storeLocations[0].address}</span> :
                <span>{props.deliveryOption.description}</span>
            }
            {
              props.deliveryOption.deliveryServiceId === 'DPO' &&
              <div>
                <span>Veldu póstbox: </span>
                <select name="selectPostbox" id="selectPostbox" onChange={props.updateSelectedPostbox} value={props.selectedPostbox}>
                  <option value="">.....</option>
                  {postboxes}
                </select>
              </div>
            }
          </div>
          <div className="priceDiv col-md-1">
            <h4>Verð</h4>
            <span>{props.deliveryOption.priceRelated.bruttoPrice}</span>
          </div>
        </div>
      </label>
    </div>
  );
};

export default DeliveryOption;
