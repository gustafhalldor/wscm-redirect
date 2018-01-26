import { combineReducers } from 'redux';
import transactionReducer from './transactionReducer.js';
import deliveryOptionsReducer from './deliveryOptionsReducer.js';

export default combineReducers({
  transactionDetails: transactionReducer,
  deliveryOptions: deliveryOptionsReducer
})
