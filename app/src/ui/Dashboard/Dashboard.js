import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreatorsExt } from '../../utils/bindActionCreatorsExt'
import { ActionCreators } from '../../actions'
import WalletInfo from '../WalletInfo/WalletInfo'
import classNames from 'classnames'
import TransactionHistory from '../TransactionHistory/TransactionHistory'
import Close from 'react-icons/lib/md/close'
import ReactModal from 'react-modal'
import QRCode from 'qrcode.react'
import CopyToClip from '../../components/CopyToClipboard'
import AddRecipientDisplay from './AddRecipientDisplay'
import { isValidPublicAddress } from '../../api/crypto/index'
import ConfirmDisplay from './ConfirmDisplay'

import FaArrowUpward from 'react-icons/lib/fa/arrow-circle-up'
import FaArrowDownward from 'react-icons/lib/fa/arrow-circle-down'

import styles from './Dashboard.scss'
import { ASSETS } from '../../core/constants';

class Dashboard extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            receiveModal:false,
            sendModal:false,
            display:'',
            assetType:'NEO',
            destinationaddress:'',
            amount:0
          };
      
    }

    _toggleReceiveModal=()=>{
        this.setState({
            receiveModal:!this.state.receiveModal
        })
    }

    _toggleSendModal=()=>{
      this.setState({
          sendModal:!this.state.sendModal
      })
  }

  renderDisplay = () => {
    const { net, address,neo } = this.props
    const { display } = this.state

    if (display !== 'confirm') {
      return (
        <AddRecipientDisplay
          balance={neo}
          onCancel={this._toggleSendModal}
          onConfirm={this.handleConfirmAddRecipient} />
      )
    } else {
      return (
        <ConfirmDisplay
          net={net}
          senderaddress={address}
          amount={this.state.amount}
          symbol={this.state.assetType}
          destinationaddress={this.state.destinationaddress}
          onConfirm={this.handleConfirmTransaction}
          onCancel={this.handleCancelTransaction}
          {...this.state} />
      )
    }
  }

  handleCancelTransaction=()=>{
    this.setState({
      sendModal:!this.state.sendModal,
      display:''
    })
  }

  handleConfirmTransaction=()=>{
    this.props.wallet.sendAsset(this.state.destinationaddress, this.state.amount, this.state.assetType)
  }

  _isValidInputForm(address, amount, assetType) {
    let result = true
    const balance = assetType == ASSETS.NEO ? this.props.neo : this.props.gas
    if (address == undefined || address.length <= 0 || isValidPublicAddress(address) != true || address.charAt(0) !== 'A') {
        alert('Not a valid destination address')
        result = false
    } else if (amount == undefined || amount < 0) {
        alert('Invalid amount')
        result = false
    } else if (amount > balance) {
        alert('Not enough ' + `${assetType}`)
        result = false
    } else if (assetType == ASSETS.NEO && parseFloat(amount) !== parseInt(amount)) {
        alert('Cannot not send fractional amounts of ' + `${assetType}`)
        result = false
    }
    return result
}

  handleConfirmAddRecipient = ({address,amount,assetType})=>{
      //const {address,amount,assetType}=this.state
      debugger
      if(this._isValidInputForm(address,amount,this.state.assetType)){
        this.setState({
          display:'confirm',
          destinationaddress:address,
          amount:amount,
          
        })
      }
  }

    render()
    {
        const{address}=this.props
        return(
            <div id='dashboard' className={styles.container}>
            <div className={styles.content}>
              <div className={styles.contentBox}>
                <div className={styles.walletButtons}>
    
                  <div
                    className={classNames(styles.walletButton, styles.sendButton)}
                    onClick={this._toggleSendModal}
                  >

                      <FaArrowUpward className={styles.walletButtonIcon} />
                      <span className={styles.walletButtonText}>Send</span>
                    
                  </div>

                  <div>

                      <ReactModal
    isOpen={this.state.receiveModal}
    onRequestClose={false}
    
    style={{
      content: {
        width: '480px',
        height: '460px',
        margin: 'auto',
        padding: 0,
        boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 4px',
        border: 'none',
        borderRadius: '4px',
        display: 'flex',
        flexDirection: 'column',
        
      },
      overlay: {
        backgroundColor: 'rgba(26, 54, 80, 0.25)',
        margin: 'auto',
        
      }
    }}
    
    
  >
    <div className={styles.modalHeader}>
      <div className={styles.modalHeaderTitle}>NEO Wallet Address</div>
      <div className={styles.modalHeaderCloseButton} onClick={this._toggleReceiveModal}><Close /></div>
    </div>
    <div className={classNames(styles.modalBody)}>
    <div className={styles.textContainer}>
    
          <div>Your Public NEO Address:</div>
          <div className={styles.address}>
          <span className={classNames(styles.address)} onClick={null}>
        {address}
      </span>
            <CopyToClip text={address} tooltip='Copy Public Key' />
            
            
          </div> 
          <div className={styles.canvas}>
          <QRCode value={address} />
           </div>    
              
          <div>Only send assets, such as NEO and GAS, and tokens, such as RPX, that are compatible with the NEO Blockchain.</div>
          <div>Sending any other digital asset or token will result in permanent loss.</div>
        </div>
    </div>
  </ReactModal>

                      </div>


<ReactModal
    isOpen={this.state.sendModal}
    onRequestClose={false}
    
    style={{
      content: {
        width: '925px',
        height: '410px',
        margin: 'auto',
        padding: 0,
        boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 4px',
        border: 'none',
        borderRadius: '4px',
        display: 'flex',
        flexDirection: 'column',
        
      },
      overlay: {
        backgroundColor: 'rgba(26, 54, 80, 0.25)',
        margin: 'auto',
        
      }
    }}
    
    
  >

  <div className={styles.modalHeader}>
      <div className={styles.modalHeaderTitle}>Send</div>
      <div className={styles.modalHeaderCloseButton} onClick={this.handleCancelTransaction}><Close /></div>
    </div>

    <div className={classNames(styles.modalBody)}>
        {this.renderDisplay()}
    </div>

  </ReactModal>




                  <div
                    className={styles.walletButton}
                    onClick={this._toggleReceiveModal}
                  >
                    <FaArrowDownward className={styles.walletButtonIcon} />
                    <span className={styles.walletButtonText}>Receive</span>
                  </div>
                </div>
                <WalletInfo />
              </div>
              <div
                className={classNames(styles.contentBox, styles.transactionHistory)}
              >
                <TransactionHistory />
              </div>
            </div>
          </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
      neoPrice:state.wallet.neoPrice,
      gasPrice:state.wallet.gasPrice,
      neo:state.wallet.neo,
      gas:state.wallet.gas,
      address:state.wallet.address
    }
  }
  
  const mapDispatchToProps = dispatch => {
    return bindActionCreatorsExt(ActionCreators, dispatch)
  }
  export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
  