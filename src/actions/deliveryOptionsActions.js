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
