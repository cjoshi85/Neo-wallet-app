import React from 'react'
import classNames from 'classnames'
import { isNil, keyBy } from 'lodash'
import { formatGAS, formatFiat, formatNEO } from '../../core/formatters'
import { ASSETS, CURRENCIES, MODAL_TYPES, ENDED_ICO_TOKENS } from '../../core/constants'
import { toBigNumber } from '../../core/math'
import Tooltip from '../../components/Tooltip'

import MdSync from 'react-icons/lib/md/sync'

import styles from './WalletInfo.scss'

import { connect } from 'react-redux';
import { bindActionCreatorsExt } from '../../utils/bindActionCreatorsExt'
import { ActionCreators } from '../../actions'

class WalletInfo extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {

        const{neoPrice,NEO,gasPrice,GAS,currencyCode}=this.props
        

        debugger

    const invalidPrice = isNil(neoPrice) || isNil(gasPrice)

    debugger

    const neoValue = neoPrice && NEO && NEO !== '0'
      ? toBigNumber(neoPrice).multipliedBy(NEO) : toBigNumber(0)

    //   const neoValue=toBigNumber(neoPrice).multipliedBy(NEO)
     // alert(neoValue)

    const gasValue = gasPrice && GAS && GAS !== '0'
      ? toBigNumber(gasPrice).multipliedBy(GAS) : toBigNumber(0)

    const totalValue = neoValue.plus(gasValue).toString()

    const displayCurrencyCode = (currencyCode||'USD').toUpperCase()
    //const displayCurrencyCode ='USD'
    const currencySymbol = '$'

        return (
            <div id='accountInfo'>
                <div id='balance'>
                    <div className='split'>
                        <div className='label'>{ASSETS.NEO}</div>
                        <div className='amountBig amountNeo'>{NEO ? formatNEO(NEO) : '-'}</div>
                        <div className='fiat neoWalletValue'>
                            {currencySymbol}
                            {invalidPrice ? '-' : <span>{formatFiat(neoValue)} {displayCurrencyCode}</span>}
                        </div>
                    </div>
                    <div className='split'>
                        <div className='label'>{ASSETS.GAS}</div>
                        <div className='amountBig amountGas'>
                            {GAS
                                ? <Tooltip title={formatGAS(GAS)} disabled={GAS === 0}>
                                    {formatGAS(GAS, true)}
                                </Tooltip> : '-'
                            }
                        </div>
                        <div className='fiat gasWalletValue'>
                            {currencySymbol}
                            {invalidPrice ? '-' : <span>{formatFiat(gasValue)} {displayCurrencyCode}</span>}
                        </div>
                    </div>
                    <div className='fiat walletTotal'>
                        Total {currencySymbol}
                        {invalidPrice ? '-' : <span>{formatFiat(totalValue)} {displayCurrencyCode}</span>}
                    </div>
                    <div
                        onClick={null}
                        className={classNames(
                            styles.refreshIconContainer,
                            'refreshBalance'
                        )}
                    >
                        <Tooltip title='Refresh account balance'>
                            <MdSync id='refresh' className={styles.refreshIcon} />
                        </Tooltip>
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
      NEO:state.wallet.neo,
      GAS:state.wallet.gas,
      currencyCode:state.wallet.currencyCode
    }
  }
  
  const mapDispatchToProps = dispatch => {
    return bindActionCreatorsExt(ActionCreators, dispatch)
  }
  export default connect(mapStateToProps, mapDispatchToProps)(WalletInfo)
  