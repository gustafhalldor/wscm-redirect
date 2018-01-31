export default function transactionReducer(state={
  apiKey: "",
  products: [],
  productsWeight: 0,
  productsPrice: 0,
  customerInfo: {
    fullName: "",
    address: "",
    postcode: "",
    countryCode: "",
    email: "",
    phone: ""
  }
}, action) {
  // eslint-disable-next-line
  switch (action.type) {
    case 'ADD_TRANSACTION_DETAILS': {
      state = {
        ...state,
        apiKey: action.payload.apiKey,
        products: action.payload.products,
        productsWeight: action.payload.productsWeight,
        productsPrice: action.payload.productsPrice,
        customerInfo: action.payload.customerInfo
      }
      break;
    }
  }
  return state;
}
