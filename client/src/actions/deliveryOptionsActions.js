export function addDeliveryOptions(deliveryOptions) {
  return {
    type: 'ADD_DELIVERY_OPTIONS',
    payload: deliveryOptions,
  };
}

export function updateSelectedOption(option) {
  return {
    type: 'UPDATE_DELIVERY_OPTION',
    payload: option,
  };
}

export function addPostboxes(postboxes) {
  return {
    type: 'ADD_POSTBOXES',
    payload: postboxes,
  };
}

export function updateSelectedPostbox(postbox) {
  return {
    type: 'UPDATE_SELECTED_POSTBOX',
    payload: postbox,
  };
}

export function addCountries(countries) {
  return {
    type: 'ADD_COUNTRIES',
    payload: countries,
  };
}

export function addPostcodes(postcodes) {
  return {
      type: 'ADD_POSTCODES',
      payload: postcodes,
  };
}

export function addDeliveryOptionsError(error) {
  return {
    type: 'ADD_DELIVERY_OPTIONS_ERROR',
    payload: error,
  };
}

export function changeFetchingDeliveryOptionsStatus(status) {
  return {
    type: 'CHANGE_FETCHING_DELIVERY_OPTIONS_STATUS',
    payload: status,
  };
}
