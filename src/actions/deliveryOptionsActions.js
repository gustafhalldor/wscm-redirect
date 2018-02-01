export function addDeliveryOptions(deliveryOptions) {
  return {
    type: 'ADD_DELIVERY_OPTIONS',
    payload: deliveryOptions
  }
}

export function updateSelectedOption(option) {
  return {
    type: 'UPDATE_DELIVERY_OPTION',
    payload: option
  }
}

export function addPostboxes(postboxes) {
  return {
    type: 'ADD_POSTBOXES',
    payload: postboxes
  }
}

export function updateSelectedPostbox(postbox) {
  return {
    type: 'UPDATE_SELECTED_POSTBOX',
    payload: postbox
  }
}

export function addCountries(countries) {
  return {
    type: 'ADD_COUNTRIES',
    payload: countries
  }
}

export function updateSelectedCountry(country) {
  return {
    type: 'UPDATE_SELECTED_COUNTRY',
    payload: country
  }
}
