import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import {Provider} from 'react-redux';
// import '../../node_modules/bootstrap/dist/css/bootstrap.css';
// import '../../node_modules/bootstrap/dist/js/bootstrap.min.js';
// import '../../node_modules/toastr/build/toastr.css';
import store from './store/configureStore';
import App from './components/App';
import { BrowserRouter } from 'react-router-dom'
import './styles/main.global.scss'


render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('app')
);