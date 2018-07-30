// @flow
import React, { Component } from 'react'

import PasswordField from '../../components/PasswordField'
import Button from '../../components/Button'
import loginStyles from '../../styles/login.scss'
import { connect } from 'react-redux';
import { bindActionCreatorsExt } from '../../utils/bindActionCreatorsExt'
import { ActionCreators } from '../../actions'
import { Link } from 'react-router-dom';

class LoginPrivateKey extends React.Component {
  state = {
    wif: ''
  }

  loginWithPrivateKey=async (wif)=>{
    try{
      await this.props.wallet.loginWithPrivateKey(wif)
      debugger
      // if(this.props.wif){
      //   debugger
      //   this.props.history.push('/dashboard')
      // }
      
    }catch(error){
      alert(error)
    }
  }

  render () {
    const { wif } = this.state
    const loginButtonDisabled = wif === ''
    debugger
    if(this.props.wif){
      this.props.history.push('/dashboard')
    }

    return (
      <div id='loginPage' className={loginStyles.loginPage}>
        <div className={loginStyles.title}>Login using a private key:</div>
        <form onSubmit={(e) => { e.preventDefault(); this.loginWithPrivateKey(wif) }}>
          <div className={loginStyles.loginForm}>
            <PasswordField
              placeholder='Enter your private key here (WIF)'
              value={wif}
              onChange={(e) => this.setState({ wif: e.target.value })}
              autoFocus
            />
          </div>
          <div className={loginStyles.buttonContainer} style={{marginLeft:'0px'}}>
            <Button type='submit' disabled={loginButtonDisabled}>Login</Button>
          </div>

           <div className="form-group" style={{textAlign:'center'}}>
            <Link to="/loginEncryptedkey" style={{color:'white'}} >
            <button className="btn btn-primary btn-lg" style={{backgroundColor: '#435a62', borderColor: '#435a62'}}>Login With Encrypted Key</button>
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
export default connect(mapStateToProps, mapDispatchToProps)(LoginPrivateKey)
