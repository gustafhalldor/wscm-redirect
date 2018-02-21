export default function creditCardReducer(state = {
  number: '',
  name: '',
  expiry: '',
  cvc: '',
  focused: '',
}, action) {
  // eslint-disable-next-line
  switch (action.type) {
    case 'UPDATE_CC_DETAILS': {
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
    }
  }
  return state;
}
