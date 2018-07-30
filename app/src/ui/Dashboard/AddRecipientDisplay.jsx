// @flow
import React from 'react'
import classNames from 'classnames'
import ArrowForward from 'react-icons/lib/md/arrow-forward'
import { pickBy } from 'lodash'
import Cleave from 'cleave.js/react'

import Button from '../../components/Button/Button'
import NumberInput from '../../components/NumberInput'
// import AddressInput from '../../Inputs/AddressInput'
// import AssetInput from '../../Inputs/AssetInput'

import { ASSETS } from '../../core/constants'
import { formatBalance, COIN_DECIMAL_LENGTH } from '../../core/formatters'

import styles from './AddRecipientDisplay.scss'
import AddressInput from '../../components/AddressInput/AddressInput';

type Props = {
  balances: Object,
  onConfirm: Function,
  onCancel: Function
}

type State = {
  address: string,
  amount: string,
  symbol: SymbolType
}

export default class AddRecipientDisplay extends React.Component<Props, State> {
  state = {
    address: '',
    amount: '',
    symbol: 'NEO'
  }

  render = () => {
    const { balance, onCancel } = this.props
    const { address, amount, symbol } = this.state

    const max = formatBalance(symbol, balance)
    debugger

    return (
      <div className={styles.addRecipientDisplay}>
        <div className={styles.inputs}>
          <div className={styles.row}>
            <div id='sendAmount' className={styles.column}>
              <label className={styles.label}>Amount:</label>
              <NumberInput
                max={balance}
                value={amount}
                placeholder='Amount'
                options={{ numeralDecimalScale: COIN_DECIMAL_LENGTH }}
                onChange={(value) => this.handleChange('amount', value)} />
              <label className={styles.label}>
                ({max} {symbol} Available)
              </label>
            </div>
            <div className={classNames(styles.column, styles.sendToIcon)}>
              <ArrowForward />
            </div>
            <div id='sendAddress' className={classNames(styles.column, styles.recipient)}>
              <label className={styles.label}>Address:</label>
              <div className={classNames(styles.numberInput)}>
              <AddressInput
                value={address}
                placeholder='Recipient Address'
                onChange={(value) => this.handleChange('address', value)} />
              </div>
              
            </div>
          </div>
        </div>
        <div className={styles.actions}>
          <Button cancel onClick={onCancel}>
            Cancel
          </Button>
          <Button id='doSend' disabled={!this.canConfirm()} onClick={this.handleConfirm}>
            Next
          </Button>
        </div>
      </div>
    )
  }

  handleChange = (key: string, value: string) => {
    this.setState({ [key]: value })
  }

  handleConfirm = () => {
    const { address, amount, symbol } = this.state
    debugger
    this.props.onConfirm({ address, amount, symbol })
  }

  canConfirm = () => {
    const { address, amount } = this.state
    return !!address && !!amount
  }

 
}
