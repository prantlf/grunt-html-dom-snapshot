'use strict'

const { checkSingleElement } = require('./utils/elements')

module.exports = {
  detect: function (command) {
    return !!command.isFocused
  },

  perform: async function (grunt, target, client, command, options) {
    const isFocused = command.isFocused
    grunt.log.ok('Checking if "' + isFocused + '" is focused.')
    if (options.singleElementSelections) {
      await checkSingleElement(client, isFocused)
    }
    return client.$(isFocused)
      .then(element => element.isFocused())
      .then(function (value) {
        if (value !== true) {
          throw new Error('"' + isFocused + '" is not focused.')
        }
      })
  }
}
