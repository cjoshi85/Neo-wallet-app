// @flow
import React from 'react'
import Button from '../../components/Button'

import Table from '../../components/Table'

import { formatBalance } from '../../core/formatters'

import styles from './ConfirmDisplay.scss'
import classNames from 'classnames'

type Props = {
  destinationaddress: string,
  senderaddress:string,
  entries: Array<SendEntryType>,
  message: string,
  onAddRecipient: Function,
  onDelete: Function,
  onConfirm: Function,
  onCancel: Function
}

type State = {
  agree: boolean
}

export default class ConfirmDisplay extends React.Component<Props, State> {
  state = {
    agree: false
  }

  render () {
    const { onConfirm, onCancel, amount,symbol, senderaddress,destinationaddress, message } = this.props
    const { agree } = this.state

    return (
      <div className={styles.confirmDisplay}>
        <div className={styles.table}>
          <Table>
            <thead>
              <tr>
                <th>Asset</th>
                <th>Recipient</th>
                
              </tr>
            </thead>
            <tbody>     
                <tr>
                  <td>{formatBalance(symbol, amount)} {symbol}</td>
                  <td>
                  <span className={classNames(styles.address)} onClick={null}>
                  { destinationaddress }
                  </span>
                  </td>
                </tr>
              
            </tbody>
          </Table>

          
        </div>

        <div className={styles.agree}>
          <input id='agree' type='checkbox' checked={agree} onChange={() => this.setState({ agree: !agree })} />
          <label htmlFor='agree'>
            I agree to transfer the above assets & tokens from{' '}
            <span className={classNames(styles.address)} onClick={null}>
                  { senderaddress }
                  </span>.
          </label>
        </div>

        <div className={styles.actions}>
          <Button cancel onClick={onCancel}>Cancel</Button>
          <Button disabled={!agree} onClick={onConfirm}>Send Assets</Button>
        </div>
      </div>
    )
  }

  handleDelete = (entry: SendEntryType) => {
    return () => this.props.onDelete(entry)
  }
}
