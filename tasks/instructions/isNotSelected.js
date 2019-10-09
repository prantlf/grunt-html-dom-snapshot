'use strict'

const { findElement, checkSingleElement } = require('./utils/elements')

module.exports = {
  detect: function (command) {
    return !!command.isNotSelected
  },

  perform: async function (grunt, target, client, command, options) {
    const isNotSelected = command.isNotSelected
    grunt.log.ok('Checking if "' + isNotSelected + '" is not selected.')
    if (options.singleElementSelections) {
      await checkSingleElement(client, isNotSelected)
    }
    return findElement(client, isNotSelected)
      .then(element => client.isElementSelected(element))
      .then(function (value) {
        if (value !== false) {
          throw new Error('"' + isNotSelected + '" is selected.')
        }
      })
  }
}
