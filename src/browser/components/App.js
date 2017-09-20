import React, { Component, PureComponent } from 'react'

import cmz from 'cmz'
import elem from '../elem'
import Info from './Info'
import Diff from './Diff'

const ipc = require('electron').ipcRenderer

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

  render () {
    return <App {...this.state} />
  }
}

module.exports = AppContainer
