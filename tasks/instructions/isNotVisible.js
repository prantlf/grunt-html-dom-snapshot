'use strict'

const { findElement } = require('./utils/elements')

module.exports = {
  detect: function (command) {
    return !!command.isNotVisible
  },

  perform: function (grunt, target, client, command) {
    const isNotVisible = command.isNotVisible
    grunt.log.ok('Checking if "' + isNotVisible + '" is not visible.')
    return findElement(client, isNotVisible)
      .then(element => client.isElementDisplayed(element))
      .then(function (value) {
        if (value !== false) {
          throw new Error('"' + isNotVisible + '" is visible.')
        }
      })
  }
}
