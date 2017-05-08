'use strict';

const
  express = require('express')

const physical = {
  // todo: replace with local dummy, rather than assumed dependency on http
  http: require('../../http/index'),
  middleware: require('../index')
}

let _app = express()
let _server = null

function _start() {
  _app.use('/healthcheck', physical.middleware({
    dependencies: [
      { name: 'google', checker: () => physical.http.check('http://google.com/') },
      { name: 'apple', checker: () => physical.http.check('http://apple.com/') },
    ]
  }))

  _app.use('/failures', physical.middleware({
    dependencies: [
      { name: 'google', checker: () => physical.http.check('http://google.com/') },
      { name: 'broken', checker: () => physical.http.check('http://httpstat.us/500')}
    ]
  }))

  _server = _app.listen(9090)
}

function _stop() {
  _server.close()
}

module.exports = {
  start: _start,
  stop: _stop
}