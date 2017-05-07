'use strict';

const
  express = require('express'),
  physical = require('../../http/index')
  physical.middleware = require('../index')


let _app = express()
let _server = null

function _start() {
  _app.use('/healthcheck', physical.middleware({
    dependencies: [
      { name: 'google', checker: () => physical.http.check('http://google.com/') },
      { name: 'apple', checker: () => physical.http.check('http://apple.com/') },
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