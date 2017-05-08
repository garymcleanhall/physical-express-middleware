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
    try {
      await app.start()
      let response = await request('http://localhost:9090/healthcheck', { json: true })
      expect(response.google).toBeDefined()
      expect(response.apple).toBeDefined()
    } finally {
      await app.stop()
    }
  }))

  it('returns 200 status if everything succeeds', testAsync(async () => {
    try {
      await app.start()
      let response = await request('http://localhost:9090/healthcheck', { resolveWithFullResponse: true })
      expect(response.statusCode).toEqual(200)
    } finally {
      await app.stop()
    }
  }))

  it('returns 500 status if anything fails', testAsync(async () => {
    try {
      await app.start()
      let response = await request('http://localhost:9090/failures', { resolveWithFullResponse: true, simple: false })
      expect(response.statusCode).toEqual(500)
    } finally {
      await app.stop()
    }
  }))
})