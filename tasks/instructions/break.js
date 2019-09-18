'use strict'

module.exports = {
  detect: function (command) {
    return !!command.break
  },

  perform: function (grunt, target, client, command) {
    const reason = command.break
    grunt.output.writeln('Breaking the loop: "' + reason + '".')
    var error = new Error('Break the loop')
    error.break = reason
    throw error
  }
}
