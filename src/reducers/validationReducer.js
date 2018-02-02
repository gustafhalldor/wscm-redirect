export default function validationReducer(state={
  inputErrors: {}
}, action) {
  // eslint-disable-next-line
  switch (action.type) {
    case 'ADD_VALIDATION_ERROR': {
      return {
        ...state,
        inputErrors: {
          ...state.inputErrors,
          [action.payload.name]: action.payload.error
        }
      }
    }
  }
  return state;
}
