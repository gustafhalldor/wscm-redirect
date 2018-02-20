export default function deliveryOptionsReducer(state = {
  options: [],
  postboxes: [],
  selectedOption: {
    id: '',
    price: '',
  },
  selectedPostbox: '',
  countries: [],
  selectedCountry: '',
  deliveryOptionsError: '',
  fetchingDeliveryOptions: false,
}, action) {
  // eslint-disable-next-line
  switch (action.type) {
    case 'ADD_DELIVERY_OPTIONS': {
      state = {
        ...state,
        options: action.payload,
      };
      break;
    }
    case 'UPDATE_DELIVERY_OPTION': {
      const updatedOption = Object.assign({ id: action.payload.id, price: action.payload.price });
      state = {
        ...state,
        selectedOption: updatedOption,
      };
      break;
    }
    case 'ADD_POSTBOXES': {
      state = {
        ...state,
        postboxes: action.payload,
      };
      break;
    }
    case 'UPDATE_SELECTED_POSTBOX': {
      state = {
        ...state,
        selectedPostbox: action.payload,
      };
      break;
    }
    case 'ADD_COUNTRIES': {
      state = {
        ...state,
        countries: action.payload,
      };
      break;
    }
    case 'UPDATE_SELECTED_COUNTRY': {
      state = {
        ...state,
        selectedCountry: action.payload,
      };
      break;
    }
    case 'ADD_DELIVERY_OPTIONS_ERROR': {
      state = {
        ...state,
        deliveryOptionsError: action.payload,
      };
      break;
    }
    case 'CHANGE_FETCHING_DELIVERY_OPTIONS_STATUS': {
      state = {
        ...state,
        fetchingDeliveryOptions: action.payload,
      };
    }
  }
  return state;
}
