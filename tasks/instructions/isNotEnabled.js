'use strict'

module.exports = {
  detect: function (command) {
    return !!command.isNotEnabled
  },

  perform: function (grunt, target, client, command) {
    const isNotEnabled = command.isNotEnabled
    grunt.log.ok('Checking if "' + isNotEnabled + '" is not enabled.')
    return client.isEnabled(isNotEnabled)
      .then(function (value) {
        if (value !== false) {
          throw new Error('"' + isNotEnabled + '" is enabled.')
        }
      })
  }
}
