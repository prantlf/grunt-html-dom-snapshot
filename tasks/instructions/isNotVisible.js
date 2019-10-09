'use strict'

const { findElement, checkSingleElement } = require('./utils/elements')

module.exports = {
  detect: function (command) {
    return !!command.isNotVisible
  },

  perform: async function (grunt, target, client, command, options) {
    const isNotVisible = command.isNotVisible
    grunt.log.ok('Checking if "' + isNotVisible + '" is not visible.')
    if (options.singleElementSelections) {
      await checkSingleElement(client, isNotVisible)
    }
    return findElement(client, isNotVisible)
      .then(element => client.isElementDisplayed(element))
      .then(function (value) {
        if (value !== false) {
          throw new Error('"' + isNotVisible + '" is visible.')
        }
      })
  }
}
