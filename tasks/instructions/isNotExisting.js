'use strict'

const { checkSingleElement } = require('./utils/elements')

module.exports = {
  detect: function (command) {
    return !!command.isNotExisting
  },

  perform: async function (grunt, target, client, command, options) {
    const isNotExisting = command.isNotExisting
    grunt.log.ok('Checking if "' + isNotExisting + '" does not exist.')
    if (options.singleElementSelections) {
      await checkSingleElement(client, isNotExisting)
    }
    return client.$(isNotExisting)
      .then(element => element.isExisting())
      .then(function (value) {
        if (value !== false) {
          throw new Error('"' + isNotExisting + '" exists.')
        }
      })
  }
}
