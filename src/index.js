import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App.js';
import Header from './Header/Header.js';
import DeliveryOptions from './DeliveryOptions/DeliveryOptions.js';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router, Route } from 'react-router-dom';

ReactDOM.render(
  <Router>
    <main>
      <Route path="/" component={Header}/> {/* TODO: Get alveg poppað þetta upp seinna, með því að hafa eitt "layout" */}
      <Route path="/:redirectkey" exact component={App}/>
      <Route path="/:redirectkey/:weight/:height?/:length?/:width?" component={DeliveryOptions}/>
      {/*<Route path="*" render = {() => (
        <h2>Ekkert að sjá hér :-)</h2>
      )} /> */}
    </main>
  </Router>,
  document.getElementById('root'));
registerServiceWorker();
