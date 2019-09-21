'use strict'

const { findElement } = require('./utils/elements')

module.exports = {
  detect: function (command) {
    return !!command.isSelected
  },

  perform: function (grunt, target, client, command) {
    const isSelected = command.isSelected
    grunt.log.ok('Checking if "' + isSelected + '" is selected.')
    return findElement(client, isSelected)
      .then(element => client.isElementSelected(element))
      .then(function (value) {
        if (value !== true) {
          throw new Error('"' + isSelected + '" is not selected.')
        }
      })
  }
}
