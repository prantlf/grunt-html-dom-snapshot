'use strict'

module.exports = {
  detect: function (command) {
    return !!command.clearValue
  },

  perform: function (grunt, target, client, command) {
    const clearValue = command.clearValue
    grunt.output.writeln('Clear value of "' + clearValue + '".')
    return client.clearElement(clearValue)
  }
}
