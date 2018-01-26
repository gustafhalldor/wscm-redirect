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
import store from './store.js'; // The Redux store

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <main>
        <Route path="/" component={Header}/> {/* TODO: Get alveg poppað þetta upp seinna, með því að hafa eitt "layout" */}
        <Switch>
          <Route path="/:redirectkey" exact component={App}/>
          <Route path="/:redirectkey/:postcode/:weight/:height?/:length?/:width?" component={DeliveryOptions}/>
          <Route path="/:redirectkey/payment" exact component={PaymentPage}/>
          {/*<Route path="*" render = {() => (
            <h2>Ekkert að sjá hér :-)</h2>
          )} /> */}
        </Switch>
      </main>
    </Router>
  </Provider>,
  document.getElementById('root'));
registerServiceWorker();
