import React, { Component } from 'react'
const ipc = require('electron').ipcRenderer

class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      isRunning: true
    }
  }

  componentWillMount () {
    ipc.on('data', (event, raw) => {
      const data = JSON.parse(raw)
      this.setState({
        isRunning: false
      })
    })
  }

  render () {
    const { isRunning } = this.state
    
    if (isRunning) {
      return <div>Running...</div>
    }

    return <div>ok</div>
  }
}

module.exports = App
