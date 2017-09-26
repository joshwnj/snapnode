import React, { Component, PureComponent } from 'react'

import cmz from 'cmz'
import elem from '../util/elem'
import Info from './Info'
import Diff from './Diff'

const ipc = require('electron').ipcRenderer

cmz(`
body {
  margin: 0;
  padding: 0;
  background: hsl(220, 30%, 10%);
  color: hsl(220, 50%, 90%);
}
`)

function normalizeSnapshotInfo (info) {
  if (!info) { return null }

  if (typeof info.recordedAt === 'string') {
    info.recordedAt = new Date(info.recordedAt)
  }

  return info
}

class App extends PureComponent {
  render () {
    const { isRunning } = this.props

    if (isRunning) {
      return <div>Running...</div>
    }

    const {
      base,
      latest
    } = this.props

    return <div>
      <Info {...this.props} />
      <Diff {...this.props} />
    </div>
  }
}

class AppContainer extends Component {
  constructor (props) {
    super(props)

    this.state = {
      isRunning: true,
      name: '',
      base: null,
      latest: null,
      unified: true
    }

    this.update = this.update.bind(this)
  }

  update () {
    ipc.send('update')
  }

  componentWillMount () {
    ipc.on('state', (event, raw) => {
      const data = JSON.parse(raw)
      this.setState({
        isRunning: false,
        name: data.name,
        base: normalizeSnapshotInfo(data.base),
        latest: normalizeSnapshotInfo(data.latest)
      })
    })

    window.onkeypress = (event) => {
      switch (event.key) {
        case '|':
          this.setState({
            unified: !this.state.unified
          })
      }
    }
  }

  render () {
    return <App
      {...this.state}
      update={this.update}
      />
  }
}

module.exports = AppContainer
