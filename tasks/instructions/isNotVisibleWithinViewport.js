'use strict'

module.exports = {
  detect: function (command) {
    return !!command.isNotVisibleWithinViewport
  },

  perform: function (grunt, target, client, command) {
    const isNotVisibleWithinViewport = command.isNotVisibleWithinViewport
    grunt.log.ok('Checking if "' + isNotVisibleWithinViewport +
                 '" is not visible within viewport.')
    return client.isVisibleWithinViewport(isNotVisibleWithinViewport)
      .then(function (value) {
        if (value !== false) {
          throw new Error('"' + isNotVisibleWithinViewport +
                          '" is visible within viewport.')
        }
      })
  }
}
