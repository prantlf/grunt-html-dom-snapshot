'use strict'

const { findElement, checkSingleElement } = require('./utils/elements')

module.exports = {
  detect: function (command) {
    return !!command.isSelected
  },

  perform: async function (grunt, target, client, command, options) {
    const isSelected = command.isSelected
    grunt.log.ok('Checking if "' + isSelected + '" is selected.')
    if (options.singleElementSelections) {
      await checkSingleElement(client, isSelected)
    }
    return findElement(client, isSelected)
      .then(element => client.isElementSelected(element))
      .then(function (value) {
        if (value !== true) {
          throw new Error('"' + isSelected + '" is not selected.')
        }
      })
  }
}
