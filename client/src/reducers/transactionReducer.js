const initState = {
  products: [],
  productsWeight: 0,
  productsPrice: 0,
  recipientInfo: {
    fullName: '',
    address: '',
    postcode: '',
    countryCode: '',
    email: '',
    phone: '',
  },
  noData: false,
  shipmentCreated: false,
  isProcessingPayment: false,
  shipmentPaid: false,
  payerIsNotRecipient: false,
  payerEmailAddress: '',
  payerEmailAddressIsValid: false,
  payerEmailAddressErrorMessage: 'Vantar tölvupóstfang',
  chargeResponse: {},
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
        recipientInfo: action.payload.recipientInfo,
      };
      break;
    }
    case 'UPDATE_RECIPIENT_INFO': {
      state = {
        ...state,
        recipientInfo: {
          ...state.recipientInfo,
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
        recipientInfo: {
          ...state.recipientInfo,
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
        recipientInfo: {
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
    case 'CHANGE_SHIPMENT_CREATED_STATUS': {
      state = {
        ...initState,
        shipmentCreated: action.payload,
      };
      break;
    }
    case 'CHANGE_SHIPMENT_PAID_STATUS': {
      state = {
        ...state,
        shipmentPaid: action.payload,
      };
      break;
    }
    case 'CHANGE_PROCESSING_PAYMENT_STATUS': {
      state = {
        ...state,
        isProcessingPayment: action.payload,
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
      break;
    }
    case 'ADD_CHARGE_RESPONSE': {
      state = {
        ...state,
        chargeResponse: action.payload,
      };
    }
  }
  return state;
}
