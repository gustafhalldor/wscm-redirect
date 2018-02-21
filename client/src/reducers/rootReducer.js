import { combineReducers } from 'redux';
import transactionReducer from './transactionReducer';
import deliveryOptionsReducer from './deliveryOptionsReducer';
import creditCardReducer from './creditCardReducer';
import validationReducer from './validationReducer';

export default combineReducers({
  transactionDetails: transactionReducer,
  deliveryOptions: deliveryOptionsReducer,
  creditCard: creditCardReducer,
  customerInfoValidation: validationReducer,
});
