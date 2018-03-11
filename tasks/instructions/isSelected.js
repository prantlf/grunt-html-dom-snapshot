'use strict'

module.exports = {
  detect: function (command) {
    return !!command.isSelected
  },

  perform: function (grunt, target, client, command) {
    const isSelected = command.isSelected
    grunt.log.ok('Checking if "' + isSelected + '" is selected.')
    return client.isSelected(isSelected)
      .then(function (value) {
        if (value !== true) {
          throw new Error('"' + isSelected + '" is not selected.')
        }
      })
  }
}
