import React, { PureComponent } from 'react'

import cmz from 'cmz'
import elem from '../util/elem'
import hasDiff from '../util/has-diff'
import relative from 'relative-date'

const Root = elem.div(cmz(`
  font-family: sans-serif
  padding: 0.5rem 1rem;
`))

const Name = elem.div(cmz(`
  font-weight: bold
  margin: 0.5rem 0
`))

const Base = elem.div()

const UpdateButton = elem.button(cmz(`
  position: absolute
  top: 1rem
  right: 1rem
`), {
  children: 'Update'
})

export default class Info extends PureComponent {
  render () {
    const {
      name,
      base,
      latest
    } = this.props

    return Root(
      Name(name),
      Base(relative(base.recordedAt)),

      hasDiff(base, latest) && UpdateButton({
        onClick: this.props.update
      })
    )
  }
}
