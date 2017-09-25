import React, { PureComponent } from 'react'
import { diffChars } from 'diff'
import cmz from 'cmz'
import elem from '../elem'

const Root = elem.div(cmz(`
& {
  border-top: 1px solid hsl(220, 10%, 20%);
  margin: 1rem 0;
}
`))

const Output = elem.div(cmz(`
& {
  font-family: "Fantasque Sans Mono", monospace;
  white-space: pre;
  padding: 1rem;
}

& > ins {
  text-decoration: none;
  background: lightgreen;
  color: #000;
  padding: 0.1rem;
}

& > del {
  text-decoration: none;
  background: salmon;
  color: #000;
  padding: 0.1rem;
}

& > span {
  background: lightgray;
  color: #000;
  padding: 0.1rem;
}
`))

const UpdateButton = elem.button(cmz(`
  margin: 1rem 0 0 1rem;
`), {
  children: 'Update'
})

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
      UpdateButton({
        onClick: this.props.update
      }),

      Output(
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
    )
  }
}
