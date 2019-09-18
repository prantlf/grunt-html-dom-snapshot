'use strict'

module.exports = {
  detect: function (command) {
    return !!command.go
  },

  perform: function (grunt, target, client, command) {
    const go = command.go
    if (!(go === 'back' || go === 'forward' || go === 'refresh' ||
          go === 'reload')) {
      throw new Error('Invalid direction to go to: "' + go +
                      '" in the target "' + target + '".\n' +
                      JSON.stringify(command))
    }
    grunt.output.writeln('Perform navigation: "' + go + '".')
    return client[go]()
  }
}
