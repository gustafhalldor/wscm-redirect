export default function transactionReducer(state={
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
    case 'ADD_BASKET_CONTENTS': {
      state = {
        ...state,
        products: action.payload }
      break;
    }
    case 'UPDATE_CUSTOMER_INFO': {
      state = {
        ...state,
        customerInfo: action.payload
      }
      break;
    }
    case 'ADD_TOTAL_PRODUCTS_WEIGHT': {
      state = {
        ...state,
        productsWeight: action.payload
      }
      break;
    }
    case 'ADD_TOTAL_PRODUCTS_PRICE': {
      state = {
        ...state,
        productsPrice: action.payload
      }
      break;
    }
  }
  return state;
}
