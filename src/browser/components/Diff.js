import React, { PureComponent } from 'react'
import { diffChars } from 'diff'
import cmz from 'cmz'
import elem from '../elem'

const Root = elem.div(cmz(`
& {
  border-top: 1px solid #000;
  margin: 1rem 0;
  padding: 1rem 0;
}

& > ins {
  text-decoration: none;
  background: lightgreen;
}

& > del {
  text-decoration: none;
  background: salmon;
}

& > span {
  background: lightgray;
}
`))

const Output = elem.div(cmz(`
  font-family: monospace
  white-space: pre
  margin: 1rem 0
`))

export default class Diff extends PureComponent {
  hasDiff () {
    const { base, latest } = this.props
    if (!latest) { return false }

    return base.data !== latest.data
  }

  render () {
    const { base, latest } = this.props

    if (!latest) {
      return Root(
        Output(base.data)
      )
    }

    if (!this.hasDiff()) {
      return Root(
        Output(base.data)
      )
    }

    const info = diffChars(
      base.data,
      latest.data
    )

    return Root(
      info.map((part, index) => {
        if (part.added) {
          return <ins key={index}>{part.value}</ins>
        } else if (part.removed) {
          return <del key={index}>{part.value}</del>
        } else {
          return <span key={index}>{part.value}</span>
        }
      })
    )
  }
}
