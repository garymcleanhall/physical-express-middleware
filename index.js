'use strict';

module.exports = (config) => {
  return async (request, response, next) => {
    
    let checkers = await Promise.all(config.dependencies.reduce((accumulator, current) => {
      accumulator.push(current.checker().then(result => ({ name: current.name, result })))
      return accumulator
    }, []))

    let healthchecks = checkers.reduce((accumulator, current) => {
      accumulator[current.name] = current.result
      return accumulator
    }, {})

    let status = checkers.every(item => item.result.isOk)

    response
      .status(status ? 200 : 500)
      .send(healthchecks)
    next()
  }
} 