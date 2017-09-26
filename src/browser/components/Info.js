import { PureComponent } from 'react'

import cmz from 'cmz'
import elem from '../util/elem'
import hasDiff from '../util/has-diff'
import relative from 'relative-date'
import { monospace } from '../styles'

const Root = elem.div(cmz(`
  font-size: 1rem;
  padding: 0.5rem 1rem;
`))

const Args = elem.div(cmz([ monospace, `
  font-size: 0.8rem;
`]))

const Base = elem.div(cmz(`
  margin: 0.5rem 0;
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
      args,
      base,
      name,
      latest
    } = this.props

    return Root(
      Args('node ', name, ' ', args),
      Base(relative(base.recordedAt)),

      hasDiff(base, latest) && UpdateButton({
        onClick: this.props.update
      })
    )
  }
}
