import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreatorsExt } from '../../utils/bindActionCreatorsExt'
import { ActionCreators } from '../../actions'
import { formatFiat } from '../../core/formatters'
import Database from "../firebase/database";
import Close from 'react-icons/lib/md/close'
import QRCode from 'qrcode.react'
import classNames from 'classnames'
import styles from './Header.scss'
import ReactModal from 'react-modal'
import CopyToClip from '../../components/CopyToClipboard'
import {generateEncryptedWIF,decryptWIF} from '../../api/crypto/index'
import Button from '../../components/Button/Button'
import { isValidPassphrase,isValidName } from '../../utils/walletStuff'
class Header extends React.Component {
    constructor(props) {
        super(props)
        this.state={
          advanceUser:false,
          showSettings:false,
          listOpen:false,
          settingOption:true,
          showWallet:false,
          createWallet:false,
          pw1:'',
          pw2:'',
          walletName:'',
          data:'',
          walletCreated:false,
          createTitle:'',
          wallets:[],
          width:'420px',
          height:'410px',
          create_width:'490px',
          create_height:'450px',
          walletSelected:false,
          selectedWallet:'Choose Wallet',
          encryptedWIF:'',
          address:'',
          passphrase:'',
          wif:''
    }
    }

    _toggleNetwork=()=>{
      this.props.network.toggle()
    }

    _toggleUser=()=>{
      this.props.wallet.toggleUser()
    }

    _toggleSettingsModal=()=>{
      this.listenAllWallets().then((wallets)=>{
        this.setState({
          showSettings:!this.state.showSettings,
          wallets
        })
      })
      
    }

    updateCurrency=(item)=>{
        this.props.wallet.updateCurrency(item)
    }

    _showWallet=()=>{
      this.setState({
        settingOption:false,
        showWallet:true,
        height:'450px',
        width:'700px'
      })
    }

    closeSettings=()=>{
       
        this.setState({
          settingOption:true,
          showSettings:!this.state.showSettings,
          showWallet:false,
          width:'420px',
          height:'410px',
       })
      
    }

    toggleList=()=>{
      this.setState({
        listOpen:!this.state.listOpen
      })
    }

    closeNewWallet=()=>{
      this.setState({
        createTitle:'Create Wallet',
        createWallet:!this.state.createWallet,
        walletCreated:false,
        create_width:'490px',
        create_height:'450px'
      })
    }

    handleChange=(e)=> {
      const { name, value } = e.target;
      this.setState({ [name]: value });
    }

    listenAllWallets = async()=>{
      const wallets=await Database.listenallwallets(this.props.userId)
      return wallets
    }

    handleConfirm = async () => {
      const{pw1,pw2,walletName}=this.state
      const {userId}=this.props
      let result
      if (isValidPassphrase(pw1, pw2)) {
        if(isValidName(walletName)){
           result= await generateEncryptedWIF(pw1)
        }
    }
      if(result.passphrase){
        this.setState({
          data:result,
          walletCreated:true,
          createTitle:'Wallet Details',
          create_height:'410px',
          create_width:'700px'
        })
        Database.setWalletData(userId, result.address, result.passphrase, result.encryptedWIF, walletName);
        
      }
}


    renderCreateWallet=()=>{
      const{pw1,pw2,walletName,data}=this.state
      if(!this.state.walletCreated){
      return(
        <div className={styles.addRecipientDisplay}>
        <div className={styles.inputs}>
            <div id='sendAddress' className={classNames(styles.column, styles.recipient)}>
              <div className={classNames(styles.numberInput)}>
              <input
                name="pw1" 
                value={pw1}
                placeholder='Enter Passphrase'
                type='password'
                onChange={this.handleChange} />
              </div>
              
            </div>

            <div id='sendAddress' className={classNames(styles.column, styles.recipient)}>
              <div className={classNames(styles.numberInput)}>
              <input
                name="pw2"
                value={pw2}
                placeholder='Enter Passphrase Again'
                type='password'
                onChange={this.handleChange} />
              </div>
              
            </div>

            <div id='sendAddress' className={classNames(styles.column, styles.recipient)}>
              <div className={classNames(styles.numberInput)}>
              <input
                name="walletName"
                value={walletName}
                placeholder='Enter Wallet Name'
                type='text'
                onChange={this.handleChange} />
              </div>
              
            </div>
            <Button id='doSend'  onClick={this.handleConfirm}>
            Create
          </Button>
          </div>
        </div>
        
      )
    }
    else{
      return(
        <div id='newWallet'>
        <div className='qrcode-container'>
        <QRCode value={data.address} />
        </div>

          <div className='keyList'>
        <div className='keyListItem'>
          <span className='label'>Passphrase:</span>
          <span className='key'>{data.passphrase}</span>
          <CopyToClip text={data.passphrase} tooltip='Copy Passphrase' />
        </div>
        <br />
        <div className='keyListItem'>
          <span className='label'>Public Address:</span>
          <span className='key'>{data.address}</span>
          <CopyToClip text={data.address} tooltip='Copy Public Address' />
        </div>
        <div className='keyListItem'>
          <span className='label'>Encrypted key:</span>
          <span className='key'>{data.encryptedWIF}</span>
          <CopyToClip text={data.encryptedWIF} tooltip='Copy Encrypted Key' />
        </div>
        <div className='keyListItem'>
          <span className='label'>Private Key:</span>
          <span className='key'>{data.wif}</span>
          <CopyToClip text={data.wif} tooltip='Copy Private Key' />
        </div>
      </div>

          </div>)
    }
    }

    _selectWallet=async (walletName)=>{
      const data = await Database.listenwalletDatabyName(this.props.userId,walletName)
      if(data){
          result=await decryptWIF(data.wif,data.passphrase)
          if(result){
              this.setState({
                  selectedWallet: walletName, 
                  encryptedWIF: data.wif,
                  address:data.address,
                  passphrase:data.passphrase,
                  wif:result.wif,
                  walletSelected: true,
              })
          }
      }
      
    }

    _showSettingsDisplay=()=>{

      const{passphrase,address,encryptedWIF,wif,roleType}=this.props
      const{wallets}=this.state
      
      console.log(wallets)
      
      const currencies = ['AUD', 'BRL', 'CAD', 'CHF', 'CLP', 'CNY', 'CZK', 'DKK', 'EUR', 'GBP', 'HKD', 'HUF', 'IDR', 'ILS', 'INR', 'JPY', 'KRW', 'MXN', 'MYR', 'NOK', 'NZD', 'PHP', 'PKR', 'PLN', 'RUB', 'SEK', 'SGD', 'THB', 'TRY', 'TWD', 'USD', 'ZAR']
      
      
      if(this.state.settingOption){
        return(
          <div>
          
          <div className={classNames(styles.walletButton, styles.sendButton)} onClick={this._showWallet}>
            <span className={styles.walletButtonText}>Show Wallet Info</span>
          
        </div>
  
        <div class="btn-group">
                  <button type="button" style={{marginLeft:'35%'}} class={classNames(styles.currencies,"btn","btn-default","dropdown-toggle")} data-toggle="dropdown">Choose Default Currency <span class="caret"></span></button>
                  <ul class={classNames("dropdown-menu", styles.scrollable)} role="menu">
                  {currencies.map((item) => (
                    <li className={classNames("dd-list-item",styles.list)} key={item} onClick={() => this.updateCurrency(item)} >{item}</li>
                  ))}
                  </ul>
              </div>
              </div>
        )
      }
      else if(this.state.showWallet){
         if(wallets.length<=1 || roleType=='Regular'){
           return(
            <div id='newWallet'>
              <div className='qrcode-container' style={{marginTop:'10px'}}>
          <QRCode value={address} />
          </div>

            <div className='keyList'>
          <div className='keyListItem'>
            <span className='label'>Passphrase:</span>
            <span className='key'>{passphrase}</span>
            <CopyToClip text={passphrase} tooltip='Copy Passphrase' />
          </div>
          <br />
          <div className='keyListItem'>
            <span className='label'>Public Address:</span>
            <span className='key'>{address}</span>
            <CopyToClip text={address} tooltip='Copy Public Address' />
          </div>
          <div className='keyListItem'>
            <span className='label'>Encrypted key:</span>
            <span className='key'>{encryptedWIF}</span>
            <CopyToClip text={encryptedWIF} tooltip='Copy Encrypted Key' />
          </div>
          <div className='keyListItem'>
            <span className='label'>Private Key:</span>
            <span className='key'>{wif}</span>
            <CopyToClip text={wif} tooltip='Copy Private Key' />
          </div>
        </div>

            </div>
           )
         }
         else{
        return(
          <div id='newWallet'>
          <div class="btn-group" style={{marginLeft:'60%'}}>
                  <button type="button" class={classNames("btn","btn-default","dropdown-toggle",styles.currencies)} data-toggle="dropdown">{this.state.selectedWallet} <span class="caret"></span></button>
                  <ul class={classNames("dropdown-menu", styles.scrollable)} role="menu">
                  {wallets.map((item) => (
                    <li className={classNames("dd-list-item",styles.list)} key={item} onClick={() => this._selectWallet(item)} >{item}</li>
                  ))}
                  </ul>
              </div>
              
          {this.state.walletSelected && 
          <div>
          <div className='qrcode-container' style={{marginTop:'10px'}}>
          <QRCode value={address} />
          </div>

            <div className='keyList'>
          <div className='keyListItem'>
            <span className='label'>Passphrase:</span>
            <span className='key'>{this.state.passphrase}</span>
            <CopyToClip text={this.state.passphrase} tooltip='Copy Passphrase' />
          </div>
          <br />
          <div className='keyListItem'>
            <span className='label'>Public Address:</span>
            <span className='key'>{this.state.address}</span>
            <CopyToClip text={this.state.address} tooltip='Copy Public Address' />
          </div>
          <div className='keyListItem'>
            <span className='label'>Encrypted key:</span>
            <span className='key'>{this.state.encryptedWIF}</span>
            <CopyToClip text={this.state.encryptedWIF} tooltip='Copy Encrypted Key' />
          </div>
          <div className='keyListItem'>
            <span className='label'>Private Key:</span>
            <span className='key'>{this.state.wif}</span>
            <CopyToClip text={this.state.wif} tooltip='Copy Private Key' />
          </div>
        </div>
        </div>
          }
          </div>
          )}    
      }
    }


    render() {
        const { address,neoPrice,gasPrice,blockHeight,net,userName,roleType } = this.props
        height=blockHeight[net]
        const toggleNetwork=(net==='TestNet')?'MainNet':'TestNet'
        const toggleUser=(roleType==='Regular')?'Advance':'Regular'
        const advance=(roleType==='Advance')?true:false
        

        debugger
        let neoDisplayPrice = '-'
        let gasDisplayPrice = '-'
        const currencySymbol = '$'

        if (neoPrice) {
          neoDisplayPrice = formatFiat(neoPrice)
        }

        if (gasPrice) {
          gasDisplayPrice = formatFiat(gasPrice)
        }
        
        return (
          <div>
          {address && <nav className="navbar navbar-expand-lg navbar-light" style={{backgroundColor:'#455962'}}>
 <a className="navbar-brand" href="#" style={{color:'#fff'}}>Navbar</a>
 <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
   <span className="navbar-toggler-icon"></span>
 </button>
 <div className="collapse navbar-collapse" id="navbarSupportedContent">
   <ul className="navbar-nav mr-auto">
     {advance && <li className="nav-item active" >
       <a className={classNames(styles.dropdown,"nav-link")} onClick={this.closeNewWallet} style={{color:'#fff'}}>Create New Wallet <span className="sr-only">(current)</span></a>
     </li>
     }

     <li className="nav-item dropdown">
       <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style={{color:'#fff'}}>
         {net}
       </a>
       <div className={classNames(styles.dropdown_menu,"dropdown-menu")} aria-labelledby="navbarDropdown">
         <a className={classNames(styles.dropdown,"dropdown-item")} onClick={this._toggleNetwork}>{toggleNetwork}</a>         
       </div>
     </li>
   </ul>
   <ul className="navbar-nav navbar-right">
   
   <li className="nav-item">
   <a className="nav-link" style={{color:'#fff'}} >NEO {currencySymbol}{neoDisplayPrice}</a>
</li>

   <li className="nav-item">
   <a className="nav-link" style={{color:'#fff'}}>GAS {currencySymbol}{gasDisplayPrice}</a>
   </li>
   <li className="nav-item">
   <a className="nav-link" style={{color:'#fff'}}>Block {blockHeight[net] || '-'}</a>
</li>
   
<ReactModal
    isOpen={this.state.showSettings}
    onRequestClose={false}
    
    style={{
      content: {
        width: this.state.width,
        height: this.state.height,
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
      <div className={styles.modalHeaderTitle}>Settings</div>
      <div className={styles.modalHeaderCloseButton} onClick={this.closeSettings}><Close /></div>
    </div>
    <div className={classNames(styles.modalBody)}>
          {this._showSettingsDisplay()}
    </div>                      
    
  </ReactModal>


  <ReactModal
    isOpen={this.state.createWallet}
    onRequestClose={false}
    
    style={{
      content: {
        width: this.state.create_width,
        height: this.state.create_height,
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
      <div className={styles.modalHeaderTitle}>Create New Wallet</div>
      <div className={styles.modalHeaderCloseButton} onClick={this.closeNewWallet}><Close /></div>
    </div>
    <div className={classNames(styles.modalBody)}>
          {this.renderCreateWallet()}
    </div>                      
    
  </ReactModal>
    
    
   <li className="nav-item dropdown">
       <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style={{color:'#fff'}}>
         {userName}
       </a>
       <div className="dropdown-menu" aria-labelledby="navbarDropdown" style={{left:'-100px', backgroundColor:'#fff'}}>
         <a className={classNames(styles.dropdown,"dropdown-item")}  onClick={this._toggleSettingsModal}>Settings</a>
         <a className={classNames(styles.dropdown,"dropdown-item")}  onClick={this._toggleUser}>Switch to {toggleUser}</a>
         <div className="dropdown-divider"></div>
         <a className={classNames(styles.dropdown,"dropdown-item")} >Log Out</a>
       </div>
     </li>
  </ul>
   {/* <form className="form-inline my-2 my-lg-0">
     <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
     <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
   </form> */}
 </div>
</nav>}
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
      generating: state.wallet.generating,
      neoPrice:state.wallet.neoPrice,
      gasPrice:state.wallet.gasPrice,
      blockHeight:state.network.blockHeight,
      net:state.network.net,
      userName:state.wallet.userName,
      roleType:state.wallet.roleType,
      userId:state.wallet.userId
    }
  }

  const mapDispatchToProps = dispatch => {
    return bindActionCreatorsExt(ActionCreators, dispatch)
  }
  export default connect(mapStateToProps, mapDispatchToProps)(Header)