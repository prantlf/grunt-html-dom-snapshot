'use strict'

// Istanbul instruments the callback to be executed in the browser,
// introduces variables there, which are defined only in the node
// part of the code and thus breaks the code.

/* istanbul ignore next */

module.exports = {
  detect: function (command) {
    return !!command.focus
  },

  perform: function (grunt, target, client, command) {
    const focus = command.focus
    grunt.output.writeln('Focus "' + focus + '".')
    return client.execute(function (selector) {
      var element = document.querySelector(selector)
      if (!element) {
        return false
      }
      element.focus()
    }, focus)
      .then(function (value) {
        if (value === false) {
          throw new Error('"' + focus + '" does not exist.')
        }
      })
  }
}
