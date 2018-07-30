import React, { Component } from 'react';
// import { StyleSheet, View, TouchableOpacity, ActivityIndicator, StatusBar, Text, TextInput, Image, Button, AsyncStorage, KeyboardAvoidingView } from 'react-native';
import { Link } from 'react-router-dom';
import Database from "./firebase/database";



import moment from 'moment';

import { bindActionCreatorsExt } from '../utils/bindActionCreatorsExt'
import { connect } from 'react-redux'
import { ActionCreators } from '../actions'

import * as firebase from "firebase";


class SignupScreen extends React.Component {

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
            loading: false,
            date: "",
            dobText: "Date",
            submitted: false,
            name:""
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);

    }

    _goToScreen(screenName, payload) {
        this.props.navigation.navigate(screenName, payload)
    }


    saveUserData() {
        Database.setUserData(this.state.uid, this.state.name,this.state.email,this.state.phone,'Regular','USD');

    }

    _renderBarIndicator() {
        
        return (

            <ActivityIndicator
                animating={true}
                size="large"
                style={styles.activityIndicator} />

        )
    }

    _loginwallet = async () => {
        if (this.props.passphrase && this.props.encryptedWIF) {
            const res = this.props.wallet.login(this.props.passphrase, this.props.encryptedWIF)
            if (res && this.state.uid) {
                this.props.history.push('\dashboard')
                Database.setWalletData(this.state.uid, this.props.address, this.props.passphrase, this.props.encryptedWIF, 'Default');
            }
        }
    }

    _generateKeys = async (pw) => {
        await this.props.wallet.create(pw, null, 'Default')
        debugger
        // if (!this.props.generating && this.props.wif != null) {
        //     this._loginwallet()
        // }
    }

    signup = async () => {
        
        try {
            const response = await firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password);
            if (response.uid) {
                this.setState({
                    uid: response.uid,
                    loading:true
                });
                this.saveUserData()
                this.passphrase = (this.state.email + this.state.phone).toString();
                await this._generateKeys(this.passphrase)
            }
        } catch (error) {
            alert(error)
        }

    }

    _storeData = async (uid) => {
        try {
            await AsyncStorage.setItem('user_id', uid);
        } catch (error) {
            alert(error)// Error saving data
        }
    }

    onDOBPress = () => {
        let dobDate = this.state.dobText;
        dobDate = new Date();
        //To open the dialog
        this.refs.dobDialog.open({
          date: dobDate,
          maxDate: new Date() //To restirct future date
        });
        }
      
    
      /**
       * Call back for dob date picked event
       *
       */
      onDOBDatePicked = (date) => {
        this.setState({
          dobText: moment(date).format('DD-MMM-YYYY')
        });
      }

      handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
      }
    
      async handleSubmit(e){
        e.preventDefault();
        this.setState({ submitted: true });
        const { password, email,phone,dob,name } = this.state;

        try {
        const passphrase=(name+moment(dob).format('MMDDYYYY')).toString()
        
        const response = await firebase.auth().createUserWithEmailAndPassword(email, password);

        if(response){
            this.setState({
                uid: response.uid,               
            });

            await this._generateKeys(passphrase)
            this.saveUserData()  
        }

        } catch (e) {
          alert(e);
        }
      }

    _create_user() {
      
        const { password,name,email,phone,dob, submitted } = this.state;
        return (
            <div className="row" >
    <div className="col-md-3"></div>
    <div className="col-md-6" style={{padding:'30px 100px 30px 100px',background: '#fff5f02e', marginTop: '55px'}}>
        <div className="container">
            <h1 className="form-heading" style={{textAlign:'center', color: '#fff'}}>Sign In</h1>
            <div className="login-form">
                <div className="main-div">
                    <form name="form" onSubmit={this.handleSubmit}>
                        <div className={'form-group' + (submitted && !name ? ' has-error' : '')}>
                            <label htmlFor="name" style={{color: '#fff'}}>Full Name</label>
                            <input type="text" className="form-control" name="name" value={name} onChange={this.handleChange} />
                {submitted && !name &&
                
                            <div className="help-block">Name is required</div>
                }
              
                        </div>
                        <div className={'form-group' + (submitted && !email ? ' has-error' : '')}>
                            <label htmlFor="email" style={{color: '#fff'}}>Email</label>
                            <input type="email" className="form-control" name="email" value={email} onChange={this.handleChange} />
                {submitted && !email &&
                
                            <div className="help-block">Email is required</div>
                }
              
                        </div>
                        <div className={'form-group' + (submitted && !password ? ' has-error' : '')}>
                            <label htmlFor="password" style={{color: '#fff'}}>Password</label>
                            <input type="text" className="form-control" name="password" value={password} onChange={this.handleChange} />
                {submitted && !password &&
                
                            <div className="help-block">password is required</div>
                }
              
                        </div>
                        <div className={'form-group' + (submitted && !phone ? ' has-error' : '')}>
                            <label htmlFor="phone" style={{color: '#fff'}}>Phone No</label>
                            <input type="text" className="form-control" name="phone" value={phone} onChange={this.handleChange} />
                {submitted && !phone &&
                
                            <div className="help-block">Phone no is required</div>
                }
              
                        </div>
                        <div className={'form-group' + (submitted && !dob ? ' has-error' : '')}>
                            <label htmlFor="dob" style={{color: '#fff'}}>DOB</label>
                            <input type="date" className="form-control" name="dob" value={dob} onChange={this.handleChange} />
                {submitted && !dob &&
                
                            <div className="help-block">DOB is required</div>
                }
              
                        </div>
                        <div className="form-group" style={{textAlign:'center'}}>
                        <button className="btn btn-primary btn-lg" style={{backgroundColor: '#435a62', borderColor: '#435a62'}}>Sign Up</button>
                        </div>
                        <div className="form-group" style={{textAlign:'center',color:'white'}}>
          {/* <button className="btn btn-primary btn-lg">Login</button> */}
            <Link to="/login" style={{color:'white'}} >Already have an account, Login Here</Link>
          </div>
                    </form>
                </div>
            </div>
        </div>
        
    </div>
        <div className="col-md-3"></div>
</div>

        );
    }


    render() {

        const { generating, wif } = this.props;
        debugger
        if (!generating && wif != null) {
           this._loginwallet()
       }

        return (
            <div className="">
                
                {this._create_user()}
            </div>
        );


    }
}


function mapStateToProps(state, ownProps) {
    return {
        wif: state.wallet.wif,
        address: state.wallet.address,
        passphrase: state.wallet.passphrase,
        encryptedWIF: state.wallet.encryptedWIF,
        generating: state.wallet.generating
    }
}

const mapDispatchToProps = dispatch => {
    return bindActionCreatorsExt(ActionCreators, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(SignupScreen)