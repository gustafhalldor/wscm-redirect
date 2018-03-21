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
  senderIsNotRecipient: false,
  senderEmailAddress: '',
  senderEmailAddressIsValid: false,
  senderEmailAddressErrorMessage: 'Tölvupóstfang er ekki á réttu formi',
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
    case 'CHANGE_SENDER_IS_NOT_RECIPIENT': {
      state = {
        ...state,
        senderIsNotRecipient: !state.senderIsNotRecipient,
      };
      break;
    }
    case 'CHANGE_SENDER_EMAIL_ADDRESS': {
      state = {
        ...state,
        senderEmailAddress: action.payload,
      };
      break;
    }
    case 'UPDATE_SENDER_EMAIL_ADDRESS_VALIDATION': {
      state = {
        ...state,
        senderEmailAddressIsValid: action.payload.isValid,
        senderEmailAddressErrorMessage: action.payload.errorMessage,
      };
    }
  }
  return state;
}
