const initState = {
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
  shipmentCreatedAndPaidForSuccessfully: false,
  payerIsNotRecipient: false,
  payerEmailAddress: '',
  payerEmailAddressIsValid: false,
  payerEmailAddressErrorMessage: 'Vantar tölvupóstfang',
};

export default function transactionReducer(state = initState, action) {
  // eslint-disable-next-line
  switch (action.type) {
    case 'ADD_TRANSACTION_DETAILS': {
      state = {
        ...state,
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
    case 'UPDATE_SELECTED_COUNTRY': {
      state = {
        ...state,
        customerInfo: {
          ...state.customerInfo,
          countryCode: action.payload,
        },
      };
      break;
    }
    case 'RESET_STATE': {
      state = {
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
    // Reset everything to initial state and flagging shipment created status to true
    case 'CHANGE_CREATED_STATUS': {
      state = {
        ...initState,
        shipmentCreatedAndPaidForSuccessfully: action.payload,
      };
      break;
    }
    case 'CHANGE_PAYER_IS_NOT_RECIPIENT': {
      state = {
        ...state,
        payerIsNotRecipient: !state.payerIsNotRecipient,
      };
      break;
    }
    case 'CHANGE_PAYER_EMAIL_ADDRESS': {
      state = {
        ...state,
        payerEmailAddress: action.payload,
      };
      break;
    }
    case 'UPDATE_PAYER_EMAIL_ADDRESS_VALIDATION': {
      state = {
        ...state,
        payerEmailAddressIsValid: action.payload.isValid,
        payerEmailAddressErrorMessage: action.payload.errorMessage,
      };
    }
  }
  return state;
}
