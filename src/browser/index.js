const React = require('react')
const elem = React.createElement
const ReactDOM = require('react-dom')
const App = require('./components/App')

const root = document.getElementById('root')
ReactDOM.render(elem(App, {}), root)
