'use strict'

module.exports = {
  detect: function (command) {
    return !!command.wait
  },

  perform: function (grunt, target, client, command, options) {
    let wait = command.wait
    if (!Array.isArray(wait)) {
      wait = wait ? [wait] : []
    }
    return wait.reduce(function (previous, wait) {
      return previous.then(function () {
        if (typeof wait === 'function') {
          grunt.output.writeln('Wait for custom function.')
          return wait(client)
        } else if (typeof wait === 'string') {
          const timeout = options.selectorTimeout
          if (wait.charAt(0) === '!') {
            wait = wait.substr(1)
            grunt.output.writeln('Wait for "' + wait +
                                  '" disappearing ' + timeout + 'ms.')
            return client.waitForExist(wait,
              options.selectorTimeout, true)
          }
          grunt.output.writeln('Wait for "' + wait +
                                '" appearing.' + timeout + 'ms.')
          return client.waitForExist(wait, timeout)
        } else if (typeof wait === 'number') {
          grunt.output.writeln('Wait for ' + wait + 'ms.')
          return new Promise(function (resolve) {
            setTimeout(resolve, wait)
          })
        }
        throw new Error('Invalid waiting instruction: "' + wait +
                        '" in the target "' + target + '".\n' +
                        JSON.stringify(command))
      })
    }, Promise.resolve())
  }
}
