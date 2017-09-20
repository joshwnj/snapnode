import React, { PureComponent } from 'react'

import cmz from 'cmz'
import elem from '../elem'

const Root = elem.div(cmz(`
  font-family: sans-serif
`))

const Name = elem.div(cmz(`
  font-weight: bold
`))

const Base = elem.div()

const Latest = elem.div()

export default class Info extends PureComponent {
  render () {
    const {
      name,
      base,
      latest
    } = this.props

    return Root(
      Name(name),
      Base(`Base recorded at: ${base.recordedAt}`),
      latest && Latest(`Latest recorded at: ${latest.recordedAt}`)
    )
  }
}
