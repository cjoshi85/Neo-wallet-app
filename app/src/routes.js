import React from 'react';
import LoginScreen from './ui/LoginScreen';
import SignupScreen from './ui/SignupScreen';
import Dashboard from './ui/Dashboard/Dashboard';
//import Dashboard from './components/dashboard/Dashboard';
//import SignUp from './components/signUp/SignUp';
import { BrowserRouter as Router, Switch, Route,Redirect } from 'react-router-dom';
import {history} from './_helpers'
import LoginPrivateKey from './ui/LoginPrivateKey/LoginPrivateKey';
import LoginNep2 from './ui/LoginNep2/LoginNep2';

//import PrivateRoute from './components/privateRoute/PrivateRoute';
export const Main = () => (
  <Router history={history}>
    <Switch>
      <Route exact path="/login" component={LoginScreen}/>
      <Route exact path="/register" component={SignupScreen}/>
      <Route exact path="/dashboard" component={Dashboard} />
      <Route exact path="/loginPrivatekey" component={LoginPrivateKey} />
      <Route exact path="/loginEncryptedkey" component={LoginNep2} />
    </Switch>
  </Router>
);
// export default (
//   <Router history={history}>
//     <App exact path="/" component={HomePage}>
//       <Route exact path="/login" component={HomePage} />
//     </App>
//   </Router>
//     <Router exact path="/" component={App} history={history}>
//       <Route exact path="/login" component={HomePage} />
//       <Route exact path="courses" component={CoursesPage} onEnter={requireAuth}/>
//       <Route path="course" component={ManageCoursePage} onEnter={requireAuth}/>
//       <Route path="course/:id" component={ManageCoursePage} onEnter={requireAuth}/>
//       <Route path="about" component={AboutPage} onEnter={requireAuth}/>
//     </Router>
// );
function requireAuth() {
 // if (localStorage.getItem('user') == null) {
    history.push('/login');
    return <LoginScreen/>;
  }
  // //else{
  //   history.push('/');
  //   return <Dashboard/>;
  // }

