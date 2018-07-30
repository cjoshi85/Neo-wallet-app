import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreatorsExt } from '../../utils/bindActionCreatorsExt'
import { ActionCreators } from '../../actions'
import classNames from 'classnames'
import { ASSETS } from '../../core/constants'
import { isZero } from '../../core/math'
import { formatBalance } from '../../core/formatters'

import styles from './Transactions.scss'

class Transactions extends React.Component{


    renderAmounts (tx: TransactionHistoryType) {
        const forceRenderNEO = !isZero(tx[ASSETS.NEO]) || isZero(tx[ASSETS.GAS])
    
        return (
          <div className={styles.amounts}>
            {this.renderAmount(tx, ASSETS.NEO, forceRenderNEO)}
            {this.renderAmount(tx, ASSETS.GAS)}
          </div>
        )
      }
    
      renderAmount (tx: TransactionHistoryType, symbol: SymbolType, forceRender: boolean = false) {
        const amount = tx[symbol]
    
        if (forceRender || !isZero(amount)) {
          return (
            <div className={classNames(styles.amount, `amount${symbol}`)}>
              {formatBalance(symbol, amount)} {symbol}
            </div>
          )
        }
      }

    render(){
        const{transactions}=this.props
       // alert(transactions.length)
            if (transactions.length === 0) {
                return( <div className={classNames(styles.noTransactions, styles.transactions)}>No transactions</div>
            )
              }

              else{
                return (
                    <ul id='transactionList' className={classNames(styles.transactionList, styles.transactionsup)}>
                      {transactions.map((tx) => (
                        <li key={tx.txid} className={styles.row}>
                          <span className={classNames(styles.transaction, styles.txid)} onClick={null}>
                            { tx.txid.substring(0, 32) }
                          </span>
                          {this.renderAmounts(tx)}
                        </li>
                      ))}
                    </ul>
                  )
              }
          

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
  export default connect(mapStateToProps, mapDispatchToProps)(Transactions)
  