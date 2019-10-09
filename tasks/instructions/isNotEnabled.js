'use strict'

const { checkSingleElement } = require('./utils/elements')

module.exports = {
  detect: function (command) {
    return !!command.isNotEnabled
  },

  perform: async function (grunt, target, client, command, options) {
    const isNotEnabled = command.isNotEnabled
    grunt.log.ok('Checking if "' + isNotEnabled + '" is not enabled.')
    if (options.singleElementSelections) {
      await checkSingleElement(client, isNotEnabled)
    }
    return client.$(isNotEnabled)
      .then(element => element.isEnabled())
      .then(function (value) {
        if (value !== false) {
          throw new Error('"' + isNotEnabled + '" is enabled.')
        }
      })
  }
}
