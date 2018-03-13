import React from 'react';

const DeliveryOption = (props) => {
  // If the delivery service is 'Pakki Póstbox' then populate the select element with the postboxes.
  let postboxes = [];
  if (props.deliveryOption.deliveryServiceId === 'DPO') {
    // get postboxes from state and map each one to an <option> element
    postboxes = props.postboxes.map((postbox, i) => {
      // select dropdown is not behaving well with different viewports. Have to trim
      // the postbox names so it is presentable.
      let name = postbox.name;
      if (window.innerWidth < 480) {
        name = postbox.name.substring(8);
        if (window.innerWidth < 370) {
          name = name.substring(0, 18);
        }
      }
      return <option key={i} value={postbox.name}>{name}</option>;
    });
  }

  return (
    <div className="flex-container-row justify-evenly">
      <input type="radio" id={props.id} value={props.deliveryOption.deliveryServiceId} name="option" onChange={props.onChange} className="input-hidden" checked={props.isChecked} />
      <label htmlFor={props.id} className="wscm-radio-panel panel panel-default label80percent">
        <div className="panel-body flex-container-row align-items-center">
          <div className="radioDiv col-sm-2">
            <i htmlFor="home" className="fa fa-circle-o fa-3x" />
            <i htmlFor="home" className="fa fa-dot-circle-o fa-3x" />
          </div>
          <div className="flex-container-column col-sm-9">
            <div className="flex-container-row deliveryOptionsLogoAndNameDiv">
              <img src={props.deliveryOption.logo} alt="delivery option logo" />
              <h4>{props.deliveryOption.nameLong}</h4>
            </div>
            <span>{props.deliveryOption.description}</span>
            {
              props.deliveryOption.deliveryServiceId === 'DPO' &&
              <div className="postboxDiv">
                <span>Veldu póstbox: </span>
                <select name="selectPostbox" id="selectPostbox" onChange={props.updateSelectedPostbox} value={props.selectedPostbox}>
                  <option value="">.....</option>
                  {postboxes}
                </select>
              </div>
            }
          </div>
          <div className="deliveryOptionsPriceDiv col-sm-1">
            <h4>Verð</h4>
            <span className="centerWithMargin">{props.deliveryOption.priceRelated.bruttoPrice}</span>
          </div>
        </div>
      </label>
    </div>
  );
};

export default DeliveryOption;
