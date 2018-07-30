import React from 'react'
// import { View, TextInput, StyleSheet } from 'react-native'
import Button from '../components/Button'
// redux
import { bindActionCreatorsExt } from '../utils/bindActionCreatorsExt'
import { connect } from 'react-redux'
import { ActionCreators } from '../actions'
import { isValidWIF } from '../api/crypto'

import styles from './loginPrivateKey.scss'

class LoginPrivateKey extends React.Component {
    _walletLogin() {
        let privateKey = this.txtPrivateKey._lastNativeText
        if (isValidWIF(privateKey)) {
            this.props.wallet.loginWithPrivateKey(privateKey)
        } else {
            alert('Invalid key')
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.loginForm}>
                    <TextInput
                        ref={txtInput => {
                            this.txtPrivateKey = txtInput
                        }}
                        multiline={false}
                        placeholder="Enter your private key (WIF) here"
                        placeholderTextColor="#636363"
                        returnKeyType="done"
                        style={styles.inputBox}
                        autoCorrect={false}
                        secureTextEntry={true}
                    />
                    <Button title="Login" onPress={this._walletLogin.bind(this)} />
                </View>
            </View>
        )
    }
}


function mapStateToProps(state, ownProps) {
    return {}
}

const mapDispatchToProps = dispatch => {
    return bindActionCreatorsExt(ActionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPrivateKey)
