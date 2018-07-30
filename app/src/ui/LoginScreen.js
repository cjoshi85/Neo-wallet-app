import { resetUserState } from '../actions/auth'
import Database from "./firebase/database";
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreatorsExt } from '../utils/bindActionCreatorsExt'
import { ActionCreators } from '../actions'
import {alertActions, userActions} from '../actions';
import * as firebase from 'firebase';
import PropTypes from "prop-types";
import {history} from "../_helpers";
import { Link } from 'react-router-dom';
import styles from './Header/Header.scss'
import ReactModal from 'react-modal'
import classNames from 'classnames'

// const {
//   LoginManager,
//   AccessToken,
//   LoginButton
// } = FBSDK;


class LoginScreen extends React.Component {

  componentWillMount() {
    const config = {
      apiKey: "AIzaSyCYwSK4rexyY6l1N82J4h0bmAY8O-l7t1A",
      authDomain: "neowallet-723e2.firebaseapp.com",
      databaseURL: "https://neowallet-723e2.firebaseio.com",
      projectId: "neowallet-723e2",
      storageBucket: "neowallet-723e2.appspot.com",
      messagingSenderId: "117276209951"
    };
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }

  }

  static navigationOptions = ({ navigation }) => ({
    headerLeftOnPress: () => {
      // requires https://github.com/react-community/react-navigation/pull/1291
      navigation.dispatch(resetUserState())
      navigation.goBack()
    }
  })
  constructor(props) {
    super(props);

    this.state = {
      uid: "",
      user: null,
      email: "",
      password: "",
      response: "",
      useExistingKey: false,
      hasToken: false,
      isLoaded: false,
      phone: "",
      address: "",
      g_user: "",
      s_user: "",
      loading: false,
      generating: false,
      approved:false
    };

    this.login = this.login.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  _goToScreen(screenName, payload) {
    this.props.navigation.navigate(screenName, payload)
  }

  async getWalletData(uid) {
    //  alert('Id' + this.userId)
    try {
      //    alert('wallet exists')
      const data = await Database.listenwalletData(uid)
      debugger
      if (data) {
        //alert(data.passphrase+"===>"+data.encryptedWIF)
        await this._walletLogin(data.passphrase, data.wif)
      }
    } catch (error) {
      alert(error)
    }


  }

  ifWalletExists = async (uid) => {
    //  alert('Id' + this.userId)
    let response = false
    const data = await Database.listenwalletData(uid)
    if (data) {
      alert('Yes' + data.passphrase + data.wif)
      response = true
      return response
    }

    return response

  }
  // alert(this.address)

  _isUserExists = async (user) => {
    let response = false
    const data = await Database.listenUserData(user.uid)
    if (data) {
      response = true
      alert('Yes')
      return response
    }
    return response
  }




  // alert(this.state.address)






  async componentDidMount() {

    // this.setState({ useExistingKey: this.props.navigation.state.params.useExistingKey })
  }


  async login() {

    try {

      const response = await firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password);
      if (response) {

        this.setState({
          user: response,
          approved:true
        });
      // await this.getWalletData(response.uid)
      }
    } catch (error) {
      alert(error)
    }

  }

  _storeData = async (uid) => {
    //  alert(uid + 'Stored')
    try {
      await AsyncStorage.setItem('user_id', uid);
    } catch (error) {
      alert(error)// Error saving data
    }
  }



  _generateKeys(pw) {

    this.props.wallet.create(pw)

  }



  _renderBarIndicator() {
    // don't use until key generation duration becomes less than 1/60 or it will block the animation
    // <View style={{ flexDirection: 'row' }}>
    //     <BarIndicator color="#236312" count={5} />
    // </View>
    return (

      <View style={styles.indicatorView}>
        <Text style={styles.indicatorText}>Generating...</Text>
      </View>

    )
  }

  _saveKey(key_name) {
    this.props.settings.saveKey(this.props.encryptedWIF, key_name)
  }

  async _walletLogin(passphrase, wif) {

    //   alert(this.props.passphrase+' '+this.props.encryptedWIF)

    try {
      //   alert('Again')
      var res = ""
      var res1 = ""

      debugger
      if (passphrase && wif) {
        ///   alert('pass' + uid + '    ' + this.props.name + 'pass' + passphrase + '===>' + wif)
        res = this.props.wallet.login(passphrase, wif)
        this.props.history.push('\loginPrivatekey')

      }

      else {
        alert(this.state.user.uid + '     ' + this.props.passphrase + '    ' + this.props.encryptedWIF)
        res1 = this.props.wallet.login(this.props.passphrase, this.props.encryptedWIF)
        Database.setWalletData(this.state.user.uid, this.props.address, this.props.passphrase, this.props.encryptedWIF, 'Default');
      }


      // if (res || res1) {
      //   await this._storeData(this.state.user.uid)

      //   setTimeout(() => {
      //     this.setState({
      //       loading: false,

      //     });
      //   }, 1000);

      // }


    } catch (error) {
      alert(error)
    }
  }

  saveUserData = () => {
    //  alert(this.state.g_user.uid + '' + this.state.s_user.email)
    Database.setUserData(this.state.user.uid, this.state.s_user.email, "12345678", "12345679");
  }

  createWallet = (pw) => {
    alert('Creating wallet')
    // const uid = await AsyncStorage.getItem('user_id')

    this.props.wallet.create(pw, null, 'Default')

  }


  _showLoginDisplay=()=>{
    return(
      <div>
          
          <div className={classNames(styles.walletButton, styles.sendButton)} onClick={this._showWallet}>
          <Link to="/loginPrivatekey" style={{color:'white'}} >
            <span className={styles.walletButtonText}>Login Using Private key</span>
            </Link>
            </div>
            <div className={classNames(styles.walletButton, styles.sendButton)} style={{marginTop:'20px'}} onClick={this._showWallet}>
            <Link to="/loginEncryptedkey" style={{color:'white'}} >
            <span className={styles.walletButtonText}>Login Using Encrypted key</span>
            </Link>
          </div>
        </div>
    )
  }
   


  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }


  async handleSubmit(e){
    e.preventDefault();
  //  this.setState({ submitted: true });
    const { password, email} = this.state;

    try {
      await this.login()
     } catch (e) {
      alert(e);
    }
  }


  render() {
    const { loggingIn } = this.props;
    const { email, password, submitted } = this.state;

    return (
      <div className="row" >
	<div className="col-md-3"></div>
	<div className="col-md-6" style={{padding:'30px 100px 30px 100px',background: '#fff5f02e', marginTop: '55px'}}>
  <div className="container">
<h1 className="form-heading" style={{textAlign:'center'}}>login</h1>
<div className="login-form">
<div className="main-div">

<ReactModal
    isOpen={this.state.approved}
    onRequestClose={false}
    
    style={{
      content: {
        width: '420px',
        height: '410px',
        margin: 'auto',
        padding: 0,
        boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 4px',
        border: 'none',
        borderRadius: '4px',
        display: 'flex',
        flexDirection: 'column',
        bottom:'0px',
        top:'90px'
        
      },
      overlay: {
        backgroundColor: 'rgba(26, 54, 80, 0.25)',
        margin: 'auto',
        
      }
    }}
    
    
  >

  <div className={styles.modalHeader}>
      <div className={styles.modalHeaderTitle}>Welcome</div>
      {/* <div className={styles.modalHeaderCloseButton} onClick={this.closeSettings}><Close /></div> */}
    </div>
    <div className={classNames(styles.modalBody)}>
          {this._showLoginDisplay()}
    </div> 

  </ReactModal>

    
    
   <form name="form" onSubmit={this.handleSubmit}>
          {alert.message &&
          <div className={`alert ${alert.type}`}>{alert.message}</div>
          }
          <div className={'form-group' + (submitted && !email ? ' has-error' : '')}>
            <label htmlFor="email" style={{color: '#fff'}}>Email</label>
            <input type="text" className="form-control" name="email" value={email} onChange={this.handleChange} />
            {submitted && !email &&
            <div className="help-block">Email is required</div>
            }
          </div>
          <div className={'form-group' + (submitted && !password ? ' has-error' : '')}>
            <label htmlFor="password"style={{color: '#fff'}}>Password</label>
            <input type="password" className="form-control" name="password" value={password} onChange={this.handleChange} />
            {submitted && !password &&
            <div className="help-block">Password is required</div>
            }
          </div>
          <div className="form-group" style={{textAlign:'center'}}>
            <button className="btn btn-primary btn-lg" style={{backgroundColor: '#435a62', borderColor: '#435a62'}}>Login</button>
            {loggingIn &&
            <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
            }
          </div>
          
          <div className="form-group" style={{textAlign:'center'}}>
          <button class="loginBtn loginBtn--google">
            Login with Google
          </button>
          <button class="loginBtn loginBtn--facebook">
             Login with Facebook
          </button>
          </div>

          <div className="form-group" style={{textAlign:'center',color:'white'}}>
          {/* <button className="btn btn-primary btn-lg">Login</button> */}
            <Link to="/register" style={{color:'white'}} >Don't have an account, Register!</Link>
          </div>
         
        </form>
    </div>

</div></div>
	</div>
	<div className="col-md-3"></div>
</div>
    );
  

  }
}


function mapStateToProps(state, ownProps) {
  return {
    wif: state.wallet.wif,
    name: state.wallet.name,
    address: state.wallet.address,
    passphrase: state.wallet.passphrase,
    encryptedWIF: state.wallet.encryptedWIF,
    generating: state.wallet.generating
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreatorsExt(ActionCreators, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)
