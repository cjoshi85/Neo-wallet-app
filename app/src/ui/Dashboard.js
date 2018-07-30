import React from 'react'
// import { StyleSheet, Platform, Image, Text, View } from 'react-native'


import { bindActionCreatorsExt } from '../utils/bindActionCreatorsExt'
import { connect } from 'react-redux'
import { ActionCreators } from '../actions'
import Database from "./firebase/database";
// import { AsyncStorage } from 'react-native';


class Dashboard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      address: "",
      generating: true,
      uid: "",
      passphrase: "",
      wif: ""
    };
  }

  async componentDidMount() {
  
  //  const value = await AsyncStorage.getItem('user_id')

  //  // alert('Entered into Dashboard')

  //   if (value) {
  //     this.setState({
  //       uid: value,
  //       generating: false
  //     })
  //   }

  }

  async _walletLogin() {

    alert('uid'+this.state.uid)

    try {
      alert('wallet exists')
      const data = await Database.listenwalletData(this.state.uid)
      if (data) {
        this.props.wallet.login(data.passphrase, data.wif)
        this.setState({
          wif: data.wif,
          passphrase: data.passphrase,
          generating: true
        })
      }
    } catch (error) {
      alert(error)
    }

  }

  _renderBarIndicator() {
    return (
      <View style={styles.indicatorView}>
        <Text style={styles.indicatorText}>Logging in...</Text>
      </View>
    )
  }

  render() {

    // if (this.state.generating) {
    //   render = this._renderBarIndicator();
    // }
    // if (!this.state.generating) {
    //   this._walletLogin()
    // }

    return (
      <div>
      <h1>About</h1>
      <p>This application uses React, Redux, React Router and a variety of other helpful libraries.</p>
    </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {

    generating: state.wallet.generating
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreatorsExt(ActionCreators, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)