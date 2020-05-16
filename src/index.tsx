import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Redirect, Route } from 'react-router-dom';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
declare var module: any;

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

const render = Component => {
  return ReactDOM.render(
    <BrowserRouter>
      <Component />
    </BrowserRouter>,
    document.getElementById('root')
  );
};

render(App);

if (module.hot) {
  module.hot.accept('./components/App', () => {
    const NextApp = require('./components/App').default;
    render(NextApp);
  });
}