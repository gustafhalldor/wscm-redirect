export function addTransactionDetails(object) {
  return {
    type: 'ADD_TRANSACTION_DETAILS',
    payload: object,
  };
}

export function updateRecipientInfo(object) {
  return {
    type: 'UPDATE_RECIPIENT_INFO',
    payload: object,
  };
}

export function changeNoDataStatus(status) {
  return {
    type: 'CHANGE_NODATA_STATUS',
    payload: status,
  };
}

export function changePriceMismatch(status) {
  return {
    type: 'CHANGE_PRICE_MISMATCH',
    payload: status,
  };
}

export function changeUnauthorizedStatus(status) {
  return {
    type: 'CHANGE_UNAUTHORIZED',
    payload: status,
  };
}

export function changePaidStatus(status) {
  return {
    type: 'CHANGE_SHIPMENT_PAID_STATUS',
    payload: status,
  };
}

export function changeProcessingPaymentStatus(status) {
  return {
    type: 'CHANGE_PROCESSING_PAYMENT_STATUS',
    payload: status,
  };
}

export function updateSelectedCountry(country) {
  return {
    type: 'UPDATE_SELECTED_COUNTRY',
    payload: country,
  };
}

export function changepayerIsNotRecipient() {
  return {
    type: 'CHANGE_PAYER_IS_NOT_RECIPIENT',
  };
}

export function changepayerEmailAddress(email) {
  return {
    type: 'CHANGE_PAYER_EMAIL_ADDRESS',
    payload: email,
  };
}

export function updatepayerEmailAddressValidation(update) {
  return {
    type: 'UPDATE_PAYER_EMAIL_ADDRESS_VALIDATION',
    payload: update,
  };
}

export function addChargeResponse(response) {
  return {
    type: 'ADD_CHARGE_RESPONSE',
    payload: response,
  };
}
