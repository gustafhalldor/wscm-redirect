export default function deliveryOptionsReducer(state={
  options: [],
  postboxes: [],
  selectedOption: {
    id: "",
    price: ""
  },
  selectedPostbox: ""
}, action) {
  // eslint-disable-next-line
  switch (action.type) {
    case 'ADD_DELIVERY_OPTIONS': {
      state = {
        ...state,
        options: action.payload
      }
      break;
    }
    case 'UPDATE_DELIVERY_OPTION': {
      const updatedOption = Object.assign({ id: action.payload.id, price: action.payload.price })
      state = {
        ...state,
        selectedOption: updatedOption
      }
      break;
    }
    case 'ADD_POSTBOXES': {
      state = {
        ...state,
        postboxes: action.payload
      }
      break;
    }
    case 'UPDATE_SELECTED_POSTBOX': {
      state = {
        ...state,
        selectedPostbox: action.payload
      }
      break;
    }
  }
  return state;
}
