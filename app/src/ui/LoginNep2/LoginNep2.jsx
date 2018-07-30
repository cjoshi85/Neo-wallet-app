// @flow
import React, { Component } from 'react'

import Button from '../../components/Button'
//import HomeButtonLink from '../../components/HomeButtonLink'
import PasswordField from '../../components/PasswordField'
//import { showSuccessNotification } from '../../modules/notifications'
import { connect } from 'react-redux';
import { bindActionCreatorsExt } from '../../utils/bindActionCreatorsExt'
import { ActionCreators } from '../../actions'
import loginStyles from '../../styles/login.scss'
import { Link } from 'react-router-dom';




class LoginNep2 extends React.Component {
  state = {
    encryptedWIF: '',
    passphrase: '',
    label: '',
    save: false
  }

  loginWithEncryptedKey=(encryptedWIF,passphrase)=>{
    try{
      this.props.wallet.login(passphrase,encryptedWIF)
    }catch(error){
      alert(error)
    }    

  }

  render () {
    
    const { encryptedWIF, passphrase} = this.state
    const loginButtonDisabled = encryptedWIF === '' || passphrase === ''

    if(this.props.encryptedWIF && this.props.passphrase){
      this.props.history.push('/dashboard')
    }

    return (
      <div id='loginPage' className={loginStyles.loginPage}>
        <div className={loginStyles.title}>Login using an encrypted key:</div>
        <form onSubmit={(e) => { e.preventDefault(); this.loginWithEncryptedKey(encryptedWIF,passphrase) }}>
          <div className={loginStyles.loginForm}>
            <PasswordField
              placeholder='Enter your passphrase here'
              onChange={(e) => this.setState({ passphrase: e.target.value })}
              value={passphrase}
              autoFocus
            />
            <PasswordField
              placeholder='Enter your encrypted key here'
              onChange={(e) => this.setState({ encryptedWIF: e.target.value })}
              value={encryptedWIF}
            />
          </div>
          <div>
            <Button
              id='loginButton'
              type='submit'
              disabled={loginButtonDisabled}>Login</Button>
          </div>
          
          <div className="form-group" style={{textAlign:'center'}}>
            <Link to="/loginPrivatekey" style={{color:'white'}} >
            <button className="btn btn-primary btn-lg" style={{backgroundColor: '#435a62', borderColor: '#435a62'}}>Login With Private Key</button>
            </Link>
            </div>
            </form>
      </div>
    )
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
export default connect(mapStateToProps, mapDispatchToProps)(LoginNep2)

