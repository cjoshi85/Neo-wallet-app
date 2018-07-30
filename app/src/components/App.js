/* Import statements */
import React from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import {Main} from '../routes';
import { history } from '../_helpers';
import Header from '../ui/Header/Header'

/* App component */
class App extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="container-fluid">
        <Header />
        <Main/>
      </div>
    );
  }
}

export default App;
