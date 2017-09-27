import React, { PureComponent } from 'react'
import { diffWords, diffLines } from 'diff'
import cmz from 'cmz'
import elem from '../util/elem'
import hasDiff from '../util/has-diff'
import colors from '../styles/colors'
import {
  monospace,
  scroll
} from '../styles'

const code = cmz([ monospace, scroll, `
  padding: 1rem
`])

const Output = elem.div(code)

const UnifiedView = elem.div(cmz([ code, `
& {
  width: 100%;
}

& > * {
  text-decoration: none;
  color: #000;
  padding: 0.1rem;
  line-height: 1.3;
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
`]))

const SplitView = elem.div(cmz(`
& {
  display: flex;
  width: 100%;
}

& > div {
  width: 50%;
}

& > div:first-child {
  border-right: 1px solid ${colors.border}
}
`))

function hasLines (data) {
  return data.trim().indexOf('\n') > 0
}

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

    if (!hasDiff(base, latest)) {
      return Output(base.data)
    }

    if (unified) {
      const diff = hasLines(base.data) || hasLines(latest.data)
        ? diffLines
        : diffWords

      const info = diff(
        base.data,
        latest.data
      )

      return UnifiedView(info.map(this.renderPart))
    }

    return SplitView(
      Output(base.data),
      Output(latest.data)
    )
  }
}
