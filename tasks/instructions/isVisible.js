'use strict'

const { findElement } = require('./utils/elements')

module.exports = {
  detect: function (command) {
    return !!command.isVisible
  },

  perform: function (grunt, target, client, command) {
    const isVisible = command.isVisible
    grunt.log.ok('Checking if "' + isVisible + '" is visible.')
    return findElement(client, isVisible)
      .then(element => client.isElementDisplayed(element))
      .then(function (value) {
        if (value !== true) {
          throw new Error('"' + isVisible + '" is not visible.')
        }
      })
  }
}
