export default function transactionReducer(state = {
  apiKey: '',
  products: [],
  productsWeight: 0,
  productsPrice: 0,
  customerInfo: {
    fullName: '',
    address: '',
    postcode: '',
    countryCode: '',
    email: '',
    phone: '',
  },
  noData: false,
  created: false,
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
        customerInfo: action.payload.customerInfo,
      };
      break;
    }
    case 'UPDATE_CUSTOMER_INFO': {
      state = {
        ...state,
        customerInfo: {
          ...state.customerInfo,
          [action.payload.fieldName]: action.payload.value,
        },
      };
      break;
    }
    case 'CHANGE_NODATA_STATUS': {
      state = {
        ...state,
        noData: action.payload,
      };
      break;
    }
    case 'RESET_STATE': {
      state = {
        apiKey: '',
        products: [],
        productsWeight: 0,
        productsPrice: 0,
        customerInfo: {
          fullName: '',
          address: '',
          postcode: '',
          countryCode: '',
          email: '',
          phone: '',
        },
        noData: false,
      };
      break;
    }
    case 'CHANGE_CREATED_STATUS': {
      state = {
        ...state,
        created: action.payload,
      };
    }
  }
  return state;
}
