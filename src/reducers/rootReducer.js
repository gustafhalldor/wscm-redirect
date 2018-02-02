import { combineReducers } from 'redux';
import transactionReducer from './transactionReducer.js';
import deliveryOptionsReducer from './deliveryOptionsReducer.js';
import creditCardReducer from './creditCardReducer.js';
import validationReducer from './validationReducer';

export default combineReducers({
  transactionDetails: transactionReducer,
  deliveryOptions: deliveryOptionsReducer,
  creditCard: creditCardReducer,
  customerInfoValidation: validationReducer
})
