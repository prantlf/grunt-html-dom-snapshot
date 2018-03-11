'use strict'

module.exports = {
  detect: function (command) {
    return !!command.isNotSelected
  },

  perform: function (grunt, target, client, command) {
    const isNotSelected = command.isNotSelected
    grunt.log.ok('Checking if "' + isNotSelected + '" is not selected.')
    return client.isSelected(isNotSelected)
      .then(function (value) {
        if (value !== false) {
          throw new Error('"' + isNotSelected + '" is selected.')
        }
      })
  }
}
