export default function deliveryOptionsReducer(state={
  options: [],
}, action) {
  switch (action.type) {
    case 'ADD_DELIVERY_OPTIONS': {
      return {
        ...state,
        options: action.payload
      }
    }
  }
  return state;
}
