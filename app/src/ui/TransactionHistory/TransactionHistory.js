import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreatorsExt } from '../../utils/bindActionCreatorsExt'
import { ActionCreators } from '../../actions'
import Transactions from './Transactions'
import styles from './TransactionHistory.scss'


class TransactionHistory extends React.Component{
    render(){
        
        return(
            <div id='transactionInfo' className={styles.transactionInfo}>
        <div id='columnHeader' className={styles.columnHeader}>
          Transaction History
        </div>
        <div className={styles.headerSpacer} />
        {
          <Transactions className={styles.transactions} />
        }
      </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
      transactions:state.wallet.transactions
    }
  }
  
  const mapDispatchToProps = dispatch => {
    return bindActionCreatorsExt(ActionCreators, dispatch)
  }
  export default connect(mapStateToProps, mapDispatchToProps)(TransactionHistory)
  