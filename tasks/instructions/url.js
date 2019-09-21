'use strict'

module.exports = {
  detect: function (command) {
    return !!command.url
  },

  perform: function (grunt, target, client, command) {
    const url = command.url
    grunt.log.ok('Navigate to "' + url + '".')
    return client.navigateTo(url)
  }
}
