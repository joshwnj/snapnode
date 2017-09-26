import React, { PureComponent } from 'react'
import { diffChars } from 'diff'
import cmz from 'cmz'
import elem from '../util/elem'
import hasDiff from '../util/has-diff'

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

& > * {
  text-decoration: none;
  color: #000;
  padding: 0.1rem;
}

& > ins {
  background: lightgreen;
}

& > del {
  background: salmon;
}

& > span {
  background: lightgray;
}
`))

const UpdateButton = elem.button(cmz(`
  margin: 1rem 0 0 1rem;
`), {
  children: 'Update'
})

export default class Diff extends PureComponent {
  constructor (props) {
    super(props)
    this.renderPart = this.renderPart.bind(this)
  }

  renderPart (part, index) {
    if (part.added) {
      return <ins key={index}>{part.value}</ins>
    } else if (part.removed) {
      return <del key={index}>{part.value}</del>
    } else {
      return <span key={index}>{part.value}</span>
    }
  }

  render () {
    const { base, latest } = this.props

    if (!latest) {
      return Root(
        Output(base.data)
      )
    }

    if (!hasDiff(base, latest)) {
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

      Output(info.map(this.renderPart))
    )
  }
}
