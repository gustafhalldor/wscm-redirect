import { applyMiddleware, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import allReducers from './reducers/rootReducer';

const middleware = applyMiddleware(thunk, createLogger());

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['creditCard'], // creditCard info will not be persisted
};

const persistedReducer = persistReducer(persistConfig, allReducers);

// export default createStore(allReducers, middleware)

export default () => {
  const store = createStore(persistedReducer, middleware);
  const persistor = persistStore(store);
  return { store, persistor };
};
