import React, { PureComponent } from 'react'
import { diffChars } from 'diff'
import cmz from 'cmz'
import elem from '../util/elem'
import hasDiff from '../util/has-diff'
import colors from '../styles/colors'

const Root = elem.div(cmz(`
  border-top: 1px solid ${colors.border};
  margin: 1rem 0 0 0;
  flex-grow: 1;
  display: flex;
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
  background: ${colors.green};
}

& > del {
  background: ${colors.red};
}

& > span {
  background: ${colors.grey};
}
`))

const SplitView = elem.div(cmz(`
& {
  display: flex;
  width: 100%;
}

& > div {
  width: 50%;
}
`))

const LeftPane = elem.div(cmz(`
  border-right: 1px solid ${colors.border}
`))

const RightPane = elem.div(cmz(`

`))

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
    const {
      base,
      latest,
      unified
    } = this.props

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

    if (unified) {
      const info = diffChars(
        base.data,
        latest.data
      )

      return Root(
        Output(info.map(this.renderPart))
      )
    } else {
      return Root(
        SplitView(
          LeftPane(
            Output(base.data)
          ),

          RightPane(
            Output(latest.data)
          )
        )
      )
    }
  }
}
