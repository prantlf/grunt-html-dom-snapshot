'use strict'

const { checkSingleElement } = require('./utils/elements')

module.exports = {
  detect: function (command) {
    return !!command.isVisible
  },

  perform: async function (grunt, target, client, command, options) {
    const isVisible = command.isVisible
    grunt.log.ok('Checking if "' + isVisible + '" is visible.')
    if (options.singleElementSelections) {
      await checkSingleElement(client, isVisible)
    }
    return client.$(isVisible)
      .then(element => element.isDisplayed(element))
      .then(function (value) {
        if (value !== true) {
          throw new Error('"' + isVisible + '" is not visible.')
        }
      })
  }
}
