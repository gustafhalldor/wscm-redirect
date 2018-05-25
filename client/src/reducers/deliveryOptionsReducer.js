const initState = {
    options: [],
    postboxes: [],
    selectedOption: {
      id: '',
      price: 0,
    },
    selectedPostbox: {
      name: '',
      postcode: '',
    },
    countries: [],
    postcodes: [],
    deliveryOptionsError: '',
    fetchingDeliveryOptions: false,
};

export default function deliveryOptionsReducer(state = initState, action) {
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
        selectedPostbox: {
          name: action.payload.name,
          postcode: action.payload.postcode,
        },
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
    case 'ADD_POSTCODES': {
      state = {
          ...state,
          postcodes: action.payload,
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
      break;
    }
    // called by PaymentPage after a shipment has been successfully created
    case 'CHANGE_CREATED_STATUS': {
      if (action.payload === true) {
        state = {
          ...initState,
        };
      }
      break;
    }
  }
  return state;
}
