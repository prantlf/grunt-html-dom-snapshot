'use strict'

const { checkSingleElement } = require('./utils/elements')

module.exports = {
  detect: function (command) {
    return !!command.isEnabled
  },

  perform: async function (grunt, target, client, command, options) {
    const isEnabled = command.isEnabled
    grunt.log.ok('Checking if "' + isEnabled + '" is enabled.')
    if (options.singleElementSelections) {
      await checkSingleElement(client, isEnabled)
    }
    return client.$(isEnabled)
      .then(element => element.isEnabled())
      .then(function (value) {
        if (value !== true) {
          throw new Error('"' + isEnabled + '" is not enabled.')
        }
      })
  }
}
