import { applyMiddleware, createStore } from 'redux';
import { createLogger } from "redux-logger";
import thunk from 'redux-thunk';
import allReducers from './reducers/rootReducer.js';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const middleware = applyMiddleware(thunk, createLogger());

const persistConfig = {
  key: 'root',
  storage: storage,
}

const persistedReducer = persistReducer(persistConfig, allReducers)

//export default createStore(allReducers, middleware)

export default () => {
  let store = createStore(persistedReducer, middleware);
  let persistor = persistStore(store);
  return { store, persistor };
}
