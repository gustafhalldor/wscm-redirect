export function addTransactionDetails(object) {
  return {
    type: 'ADD_TRANSACTION_DETAILS',
    payload: object
  }
}

export function updateCustomerInfo(object) {
  return {
    type: 'UPDATE_CUSTOMER_INFO',
    payload: object
  }
}