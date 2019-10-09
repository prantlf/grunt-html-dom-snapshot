'use strict'

const { checkSingleElement } = require('./utils/elements')

module.exports = {
  detect: function (command) {
    return !!command.isExisting
  },

  perform: async function (grunt, target, client, command, options) {
    const isExisting = command.isExisting
    grunt.log.ok('Checking if "' + isExisting + '" exists.')
    if (options.singleElementSelections) {
      await checkSingleElement(client, isExisting)
    }
    return client.$(isExisting)
      .then(element => element.isExisting())
      .then(function (value) {
        if (value !== true) {
          throw new Error('"' + isExisting + '" does not exist.')
        }
      })
  }
}
