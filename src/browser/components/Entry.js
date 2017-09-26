import { PureComponent } from 'react'
import cmz from 'cmz'
import elem from '../util/elem'
import hasDiff from '../util/has-diff'
import colors from '../styles/colors'

const EntryDiv = elem(cmz(`
  padding: 1rem
  min-width: 10rem
`))

const highlight = cmz(`
  background: rgba(0,0,0,0.3)
`)

const Marker = elem.span(cmz(`
  display: inline-block
  width: 0.5rem
  height: 0.5rem
  border-radius: 0.5rem
  margin-right: 0.5rem
  background: ${colors.red}
`))

export default class Entry extends PureComponent {
  constructor (props) {
    super(props)

    this.onClick = this.onClick.bind(this)
  }

  onClick (event) {
    this.props.selectEntry(this.props.index)
  }

  render () {
    const {
      selected,
      index,
      file,
      base,
      latest
    } = this.props

    const diffMarker = hasDiff(base, latest) && Marker()
    const className = selected === index ? highlight : ''

    return EntryDiv(
      {
        className,
        onClick: this.onClick
      },
      diffMarker,
      file
    )
  }
}
