import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import LandingPage from './LandingPage/LandingPage';
import Header from './Header/Header';
import NotFound from './NotFound/NotFound';
import DeliveryOptions from './DeliveryOptions/DeliveryOptions';
import PaymentPage from './PaymentPage/PaymentPage';
import FinalPage from './FinalPage/FinalPage';
import registerServiceWorker from './registerServiceWorker';
import reduxStore from './store'; // The Redux store
import './index.css';

const { store, persistor } = reduxStore();

ReactDOM.render(
  <Provider store={store}>
    {/*  NOTE loading is set to null for simplicity, but in practice should be any react instance, e.g. loading={<SomeLoadingIcon />} */}
    <PersistGate loading={null} persistor={persistor}>
      <Router>
        <main>
          {/*<Route path="/" component={Header} />  TODO: Get alveg poppað þetta upp seinna, með því að hafa eitt "layout" */}
          <Header />
          <Switch>
            <Route path="/:redirectkey" component={LandingPage} exact />
            <Route path="/:redirectkey/deliveryOptions" component={DeliveryOptions} exact />
            <Route path="/:redirectkey/payment" component={PaymentPage} exact />
            <Route path="/:redirectkey/final" component={FinalPage} exact />
            <Route component={NotFound} />
          </Switch>
        </main>
      </Router>
    </PersistGate>
  </Provider>,
  document.getElementById('root'),
);
registerServiceWorker();
