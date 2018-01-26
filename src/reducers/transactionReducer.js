export default function transactionReducer(state={
  products: [],
  productsWeight: 0,
  productsPrice: 0,
  customerInfo: {}
}, action) {
  switch (action.type) {
    case 'ADD_BASKET_CONTENTS': {
      return {
        ...state,
        products: action.payload
      }
    }
    case 'ADD_CUSTOMER_INFO': {
      return {
        ...state,
        customerInfo: action.payload
      }
    }
    case 'ADD_TOTAL_PRODUCTS_WEIGHT': {
      return {
        ...state,
        productsWeight: action.payload
      }
    }
    case 'ADD_TOTAL_PRODUCTS_PRICE': {
      return {
        ...state,
        productsPrice: action.payload
      }
    }
  }
  return state;
}
