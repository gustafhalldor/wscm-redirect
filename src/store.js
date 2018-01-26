import { applyMiddleware, createStore } from 'redux';
import { createLogger } from "redux-logger";
import thunk from 'redux-thunk';
import allReducers from './reducers/rootReducer.js';

const middleware = applyMiddleware(thunk, createLogger());

export default createStore(allReducers, middleware)
