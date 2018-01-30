export default function validationReducer(state={
  inputErrors: {},
}, action) {
  // eslint-disable-next-line
  switch (action.type) {
    case 'ADD_VALIDATION_ERROR': {
      const updated = Object.assign({}, action.payload);
      return {
        ...state,
        inputErrors: updated
      }
    }
  }
  return state;
}
