import React, { Component } from 'react'
import { diffChars } from 'diff'
const ipc = require('electron').ipcRenderer

class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      isRunning: true,
      name: '',
      base: null,
      latest: null
    }
  }

  componentWillMount () {
    ipc.on('state', (event, raw) => {
      const data = JSON.parse(raw)
      this.setState({
        isRunning: false,
        name: data.name,
        base: data.base,
        latest: data.latest
      })
    })
  }

  hasDiff () {
    const { base, latest } = this.state
    if (!latest) { return false }

    return base.data !== latest.data
  }

  renderDiff () {
    const { base, latest } = this.state

    if (!this.hasDiff()) {
      return <div>
        <div>No change</div>
        {this.renderOutput(base.data)}
      </div>
    }

    const info = diffChars(
      base.data,
      latest.data
    )

    return <div className="output diff">
      {info.map((part, index) => {
        if (part.added) {
          return <ins key={index}>{part.value}</ins>
        } else if (part.removed) {
          return <del key={index}>{part.value}</del>
        } else {
          return <span key={index}>{part.value}</span>
        }
      })}
    </div>
  }

  renderOutput (data) {
    return <div className="output">
      {data}
    </div>
  }

  render () {
    const { isRunning } = this.state
    
    if (isRunning) {
      return <div>Running...</div>
    }

    const {
      name,
      base,
      latest
    } = this.state

    // nothing to compare
    if (!latest) {
      return <div>
        <div>{name}</div>
        <div>Recorded at: {base.recordedAt}</div>
        {this.renderOutput(base.data)}
      </div>
    }

    return <div>
      <div>{name}</div>
      <div>Base recorded at: {base.recordedAt}</div>
      <div>Latest recorded at: {latest.recordedAt}</div>

      {this.renderDiff()}
    </div>
  }
}

module.exports = App
