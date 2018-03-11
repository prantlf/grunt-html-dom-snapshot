'use strict'

module.exports = {
  detect: function (command) {
    return !!command.keys
  },

  perform: function (grunt, target, client, command) {
    const keys = command.keys
    const message = Array.isArray(keys)
                    ? 'Send keys "' + keys.join('", "') + '".'
                    : 'Send test "' + keys + '".'
    grunt.verbose.writeln(message)
    return client.keys(keys)
  }
}
