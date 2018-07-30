// @flow
import React from 'react'
import classNames from 'classnames'

import Cleave from 'cleave.js/react'
import { omit, noop } from 'lodash'

import styles from './PasswordInput.scss'


const DEFAULT_OPTIONS = {
  numeral: true,
  numeralThousandsGroupStyle: 'thousand',
  numeralPositiveOnly: true,
  stripLeadingZeroes: true
}

type Props = {
  className?: string,
  onChange?: Function,
}

export default class PasswordInput extends React.Component<Props> {
  static defaultProps = {
    max: Infinity,
    onChange: noop,
    options: {}
  }

  render = () => {
    const { className } = this.props
    const passDownProps = omit(this.props, 'max', 'options', 'onChange', 'className')

    return (
      <div className={classNames(styles.addressInput, className)}>
        <Cleave
          {...passDownProps}
          className={styles.cleave}
          type='passsword'
          onChange={this.handleChange} />
        
      </div>
    )
  }


  handleChange = (event: Object) => {
    const { onChange } = this.props
    if (onChange) {
      return onChange(event.target.rawValue)
    }
  }

  
  getOptions = () => {
    return { ...DEFAULT_OPTIONS, ...this.props.options }
  }
}
