'use strict'

module.exports = {
  detect: function (command) {
    return !!command.isNotExisting
  },

  perform: function (grunt, target, client, command) {
    const isNotExisting = command.isNotExisting
    grunt.log.ok('Checking if "' + isNotExisting + '" does not exist.')
    return client.$(isNotExisting)
      .then(element => element.isExisting())
      .then(function (value) {
        if (value !== false) {
          throw new Error('"' + isNotExisting + '" exists.')
        }
      })
  }
}
