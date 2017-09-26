import React, { Component, PureComponent } from 'react'

import cmz from 'cmz'
import elem from '../util/elem'
import Info from './Info'
import Diff from './Diff'
import colors from '../styles/colors'

const ipc = require('electron').ipcRenderer

cmz(`
body {
  margin: 0;
  padding: 0;
  background: ${colors.darkBg};
  color: ${colors.text};
}

html,
body,
#root {
  height: 100%;
}
`)

const Layout = elem.div(cmz(`
  display: flex
  height: 100%
  flex-direction: column
`))

const DiffWrapper = elem.div(cmz(`
  border-top: 1px solid ${colors.border};
  margin: 1rem 0 0 0;
  flex-grow: 1;
  display: flex;
`))

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

    return Layout(
      <Info {...this.props} />,
      DiffWrapper(<Diff {...this.props} />)
    )
  }
}

class AppContainer extends Component {
  constructor (props) {
    super(props)

    this.state = {
      isRunning: true,
      name: '',
      args: [],
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
        args: data.args,
        base: normalizeSnapshotInfo(data.base),
        latest: normalizeSnapshotInfo(data.latest)
      })
    })

    window.onkeypress = (event) => {
      switch (event.key) {
        case '|':
        case '\\':
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
