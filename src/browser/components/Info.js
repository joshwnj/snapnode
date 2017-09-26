import { PureComponent } from 'react'

import cmz from 'cmz'
import elem from '../util/elem'
import hasDiff from '../util/has-diff'
import relative from 'relative-date'
import { monospace } from '../styles'

const Root = elem.div(cmz(`
  font-family: sans-serif;
  font-size: 1rem;
  padding: 0.5rem 1rem;
`))

const Name = elem.div(cmz(`
  font-weight: bold
  margin: 0.5rem 0
`))

const Args = elem.div(cmz([ monospace, `
  font-size: 0.8rem;
`]))

const Base = elem.div(cmz(`
  font-size: 0.8rem;
`))

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
      args,
      base,
      latest
    } = this.props

    return Root(
      Name(name),
      args && Args(args),
      Base(relative(base.recordedAt)),

      hasDiff(base, latest) && UpdateButton({
        onClick: this.props.update
      })
    )
  }
}
