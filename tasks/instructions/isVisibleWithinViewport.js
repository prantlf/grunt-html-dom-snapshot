'use strict'

module.exports = {
  detect: function (command) {
    return !!command.isVisibleWithinViewport
  },

  perform: function (grunt, target, client, command) {
    const isVisibleWithinViewport = command.isVisibleWithinViewport
    grunt.log.ok('Checking if "' + isVisibleWithinViewport +
                 '" is visible within viewport.')
    return client.isVisibleWithinViewport(isVisibleWithinViewport)
      .then(function (value) {
        if (value !== true) {
          throw new Error('"' + isVisibleWithinViewport +
                          '" is not visible within viewport.')
        }
      })
  }
}
