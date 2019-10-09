'use strict'

const { findElement, checkSingleElement } = require('./utils/elements')

module.exports = {
  detect: function (command) {
    return !!command.clearValue
  },

  perform: async function (grunt, target, client, command, options) {
    const clearValue = command.clearValue
    grunt.output.writeln('Clear value of "' + clearValue + '".')
    if (options.singleElementSelections) {
      await checkSingleElement(client, clearValue)
    }
    return findElement(client, clearValue)
      .then(element => client.elementClear(element))
  }
}
