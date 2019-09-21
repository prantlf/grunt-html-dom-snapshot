'use strict'

module.exports = {
  detect: function (command) {
    return !!command.isNotFocused
  },

  perform: function (grunt, target, client, command) {
    const isNotFocused = command.isNotFocused
    grunt.log.ok('Checking if "' + isNotFocused + '" is not focused.')
    return client.$(isNotFocused)
      .then(element => element.isFocused())
      .then(function (value) {
        if (value !== false) {
          throw new Error('"' + isNotFocused + '" is focused.')
        }
      })
  }
}
