export function addTransactionDetails(object) {
  return {
    type: 'ADD_TRANSACTION_DETAILS',
    payload: object,
  };
}

export function updateCustomerInfo(object) {
  return {
    type: 'UPDATE_CUSTOMER_INFO',
    payload: object,
  };
}

export function changeNoDataStatus(status) {
  return {
    type: 'CHANGE_NODATA_STATUS',
    payload: status,
  };
}

export function changeCreatedStatus(status) {
  return {
    type: 'CHANGE_CREATED_STATUS',
    payload: status,
  };
}

export function updateSelectedCountry(country) {
  return {
    type: 'UPDATE_SELECTED_COUNTRY',
    payload: country,
  };
}

export function changeSenderIsNotRecipient() {
  return {
    type: 'CHANGE_SENDER_IS_NOT_RECIPIENT',
  };
}

export function changeSenderEmailAddress(email) {
  return {
    type: 'CHANGE_SENDER_EMAIL_ADDRESS',
    payload: email,
  };
}

export function updateSenderEmailAddressValidation(update) {
  return {
    type: 'UPDATE_SENDER_EMAIL_ADDRESS_VALIDATION',
    payload: update,
  };
}
