'use strict';

const
  app = require('./app'),
  request = require('request-promise')

function testAsync(runAsync) {
  return done => {
    runAsync()
      .then(done, error => { 
        fail(error)
        done()
      })
  }
}

describe('Physical middleware', () => {
  it('tests downstream dependencies and gives response', testAsync(async () => {

    await app.start()

    let response = await request('http://localhost:9090/healthcheck', { json: true })
    expect(response.google).toBeDefined()
    expect(response.apple).toBeDefined()

    await app.stop()

  }))
})