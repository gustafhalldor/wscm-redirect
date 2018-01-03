import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router, Route } from 'react-router-dom';

ReactDOM.render(
  <Router>
    <div>
      <Route path="/:redirectkey" exact component={App}/>
      {/*<Route path="*" render = {() => (
        <h2>Ekkert að sjá hér :-)</h2>
      )} /> */}
    </div>
  </Router>,
  document.getElementById('root'));
registerServiceWorker();
