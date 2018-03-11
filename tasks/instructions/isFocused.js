'use strict'

module.exports = {
  detect: function (command) {
    return !!command.isFocused
  },

  perform: function (grunt, target, client, command) {
    const isFocused = command.isFocused
    grunt.log.ok('Checking if "' + isFocused + '" is focused.')
    return client.hasFocus(isFocused)
      .then(function (value) {
        if (value !== true) {
          throw new Error('"' + isFocused + '" is not focused.')
        }
      })
  }
}
