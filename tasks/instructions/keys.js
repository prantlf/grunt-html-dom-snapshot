'use strict'

module.exports = {
  detect: function (command) {
    return !!command.keys
  },

  perform: function (grunt, target, client, command) {
    let keys = command.keys
    const separateKeys = Array.isArray(keys)
    const message = separateKeys
                    ? 'Send keys "' + keys.join('", "') + '".'
                    : 'Send text "' + keys + '".'
    if (!separateKeys) {
      keys = keys.split('')
    }
    grunt.verbose.writeln(message)
    return client.keys(keys)
  }
}
