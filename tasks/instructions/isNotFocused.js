'use strict'

const { checkSingleElement } = require('./utils/elements')

module.exports = {
  detect: function (command) {
    return !!command.isNotFocused
  },

  perform: async function (grunt, target, client, command, options) {
    const isNotFocused = command.isNotFocused
    grunt.log.ok('Checking if "' + isNotFocused + '" is not focused.')
    if (options.singleElementSelections) {
      await checkSingleElement(client, isNotFocused)
    }
    return client.$(isNotFocused)
      .then(element => element.isFocused())
      .then(function (value) {
        if (value !== false) {
          throw new Error('"' + isNotFocused + '" is focused.')
        }
      })
  }
}
