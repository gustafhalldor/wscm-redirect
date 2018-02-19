import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App.js';
import Header from './Header/Header.js';
import DeliveryOptions from './DeliveryOptions/DeliveryOptions.js';
import PaymentPage from './PaymentPage/PaymentPage.js';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react'
import reduxStore from './store.js'; // The Redux store
let { store, persistor } = reduxStore();

ReactDOM.render(
  <Provider store={store}>
  {/*  NOTE loading is set to null for simplicity, but in practice should be any react instance, e.g. loading={<SomeLoadingIcon />} */}
    <PersistGate loading={null} persistor={persistor}>
      <Router>
        <main>
          <Route path="/" component={Header}/> {/* TODO: Get alveg poppað þetta upp seinna, með því að hafa eitt "layout" */}
          <Switch>
            <Route path="/:redirectkey" exact component={App}/>
            {/*<Route path="/:redirectkey/:countryCode/:postcode/:weight/:height?/:length?/:width?" component={DeliveryOptions}/>*/}
            <Route path="/:redirectkey/deliveryOptions" component={DeliveryOptions}/>
            <Route path="/:redirectkey/payment" exact component={PaymentPage}/>
            {/*<Route path="*" render = {() => (
              <h2>Ekkert að sjá hér :-)</h2>
            )} /> */}
          </Switch>
        </main>
      </Router>
    </PersistGate>
  </Provider>,
  document.getElementById('root'));
registerServiceWorker();
