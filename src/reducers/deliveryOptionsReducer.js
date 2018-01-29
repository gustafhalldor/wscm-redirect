export default function deliveryOptionsReducer(state={
  options: [],
  selectedOption: {
    id: "",
    price: ""
  }
}, action) {
  switch (action.type) {
    case 'ADD_DELIVERY_OPTIONS': {
      return {
        ...state,
        options: action.payload
      }
    }
    case 'UPDATE_DELIVERY_OPTION': {
      const updatedOption = Object.assign({ id: action.payload.id, price: action.payload.price })
      return {
        ...state,
        selectedOption: updatedOption
      }
    }
  }
  return state;
}
