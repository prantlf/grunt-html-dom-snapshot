'use strict'

const { findElement } = require('./utils/elements')

module.exports = {
  detect: function (command) {
    return !!command.clearValue
  },

  perform: function (grunt, target, client, command) {
    const clearValue = command.clearValue
    grunt.output.writeln('Clear value of "' + clearValue + '".')
    return findElement(client, clearValue)
      .then(element => client.elementClear(element))
  }
}
