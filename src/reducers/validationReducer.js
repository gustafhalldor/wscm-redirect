export default function validationReducer(state = {
  inputErrors: {
    fullName: false,
    address: false,
    postcode: false,
    countryCode: false,
    email: false,
    phone: false,
  },
}, action) {
  // eslint-disable-next-line
  switch (action.type) {
    case 'ADD_VALIDATION_ERROR': {
      return {
        ...state,
        inputErrors: {
          ...state.inputErrors,
          [action.payload.fieldName]: action.payload.error,
        },
      };
    }
  }
  return state;
}
