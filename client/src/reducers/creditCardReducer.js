export default function creditCardReducer(state = {
  number: '',
  name: '',
  expiry: '',
  cvc: '',
  focused: '',
  inputIsValid: {
    number: false,
    name: false,
    expiry: false,
    cvc: false,
  },
  inputErrorMessages: {
    // number: '',
    // name: '',
    // expiry: '',
    // cvc: '',
    number: 'Vantar kortanúmer',
    name: 'Vantar nafn korthafa',
    expiry: 'Vantar gildistíma kortsins',
    cvc: 'Vantar öryggisnúmer',
  },
  submitButtonClicked: false,
}, action) {
  // eslint-disable-next-line
  switch (action.type) {
    case 'UPDATE_CC_DETAILS': {
      // state = {
      //   ...state,
      //   submitButtonClicked: false,
      // }
      if (action.payload.name === 'number') {
        state = {
          ...state,
          number: action.payload.value.replace(/ /g, ''),
        };
      } else if (action.payload.name === 'expiry') {
        state = {
          ...state,
          expiry: action.payload.value.replace(/ |\//g, ''),
        };
      } else {
        state = {
          ...state,
          [action.payload.name]: action.payload.value,
        };
      }
      break;
    }
    case 'UPDATE_FOCUSED_FIELD': {
      state = {
        ...state,
        focused: action.payload,
      };
      break;
    }
    case 'UPDATE_FIELD_ERROR': {
      state = {
        ...state,
        inputIsValid: {
          ...state.inputIsValid,
          [action.payload.name]: action.payload.value,
        },
        inputErrorMessages: {
          ...state.inputErrorMessages,
          [action.payload.name]: action.payload.errorMessage,
        }
      };
      break;
    }
    case 'CLICKED_SUBMIT_BUTTON': {
      state = {
        ...state,
        submitButtonClicked: true,
      };
    }
  }
  return state;
}
