import React, { Component, PureComponent } from 'react'

import cmz from 'cmz'
import elem from '../util/elem'
import Entry from './Entry'
import Info from './Info'
import Diff from './Diff'
import colors from '../styles/colors'

const ipc = require('electron').ipcRenderer

cmz(`
body {
  margin: 0;
  padding: 0;
  background: ${colors.bg};
  color: ${colors.text};
  font-family: sans-serif;
}

html,
body,
#root {
  height: 100%;
}
`)

const flex = cmz(`
  display: flex
  height: 100%
`)

const Layout = elem.div([ flex, cmz(`
  flex-direction: row
`)])

const Main = elem.div([ flex, cmz(`
  flex-direction: column
  flex-grow: 1
`)])

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

const EntryList = elem(cmz(`
  border-right: 1px solid ${colors.border}
`))

class App extends PureComponent {
  constructor (props) {
    super(props)

    this.renderEntry = this.renderEntry.bind(this)
  }

  renderEntry (entry, key) {
    return <Entry
      key={key}
      index={key}
      selected={this.props.selected}
      selectEntry={this.props.selectEntry}
      {...entry}
      />
  }

  render () {
    const {
      isRunning,
      entries,
      selected,
      unified,
      update
    } = this.props

    if (isRunning) {
      return <div>Running...</div>
    }

    const entry = entries[selected]

    return Layout(
      EntryList(entries.map(this.renderEntry)),
      Main(
        <Info {...entry} update={update} />,
        DiffWrapper(<Diff unified={unified} {...entry} />)
      )
    )
  }
}

class AppContainer extends Component {
  constructor (props) {
    super(props)

    this.state = {
      isRunning: true,
      entries: [],
      selected: 0,
      unified: true
    }

    this.update = this.update.bind(this)
    this.selectEntry = this.selectEntry.bind(this)
  }

  update () {
    ipc.send('update', this.state.selected)
  }

  selectEntry (selected) {
    this.setState({ selected })
  }

  selectDelta (d) {
    const len = this.state.entries.length
    let next = (this.state.selected + d) % len
    if (next < 0) { next = len - 1 }

    this.setState({
      selected: next
    })
  }

  componentWillMount () {
    ipc.on('state', (event, raw) => {
      const data = JSON.parse(raw)
      this.setState({
        isRunning: false,
        entries: data.entries
      })
    })

    ipc.on('results', (event, raw) => {
      const { index, entry } = JSON.parse(raw)

      entry.base = normalizeSnapshotInfo(entry.base)
      entry.latest = normalizeSnapshotInfo(entry.latest)

      const entries = this.state.entries.slice()
      entries[index] = entry
      this.setState({ entries })
    })

    window.onkeypress = (event) => {
      switch (event.key) {
        case '|':
        case '\\':
          return this.setState({
            unified: !this.state.unified
          })

        case 'j':
          return this.selectDelta(1)

        case 'k':
          return this.selectDelta(-1)
      }
    }
  }

  render () {
    return <App
      {...this.state}
      update={this.update}
      selectEntry={this.selectEntry}
      />
  }
}

module.exports = AppContainer
