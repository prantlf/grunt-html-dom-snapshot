'use strict'

module.exports = {
  detect: function (command) {
    return !!command.abort
  },

  perform: function (grunt, target, client, command) {
    const reason = command.abort
    grunt.verbose.writeln('Aborting: "' + reason + '".')
    throw new Error('Aborted: "' + reason +
                    '" in the target "' + target + '".\n' +
                    JSON.stringify(command))
  }
}
