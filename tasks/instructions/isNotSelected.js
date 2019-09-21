'use strict'

const { findElement } = require('./utils/elements')

module.exports = {
  detect: function (command) {
    return !!command.isNotSelected
  },

  perform: function (grunt, target, client, command) {
    const isNotSelected = command.isNotSelected
    grunt.log.ok('Checking if "' + isNotSelected + '" is not selected.')
    return findElement(client, isNotSelected)
      .then(element => client.isElementSelected(element))
      .then(function (value) {
        if (value !== false) {
          throw new Error('"' + isNotSelected + '" is selected.')
        }
      })
  }
}
