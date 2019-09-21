'use strict'

module.exports = {
  detect: function (command) {
    return !!command.isVisibleWithinViewport
  },

  perform: function (grunt, target, client, command) {
    const isVisibleWithinViewport = command.isVisibleWithinViewport
    grunt.log.ok('Checking if "' + isVisibleWithinViewport +
                 '" is visible within viewport.')
    return client.execute(function (selector) {
      var elementToCheck = document.querySelector(selector)
      if (!elementToCheck) {
        return false
      }
      var extents = elementToCheck.getBoundingClientRect()
      var centerX = extents.left + extents.width / 2
      var centerY = extents.top + extents.height / 2
      var topElement = document.elementFromPoint(centerX, centerY)
      while (topElement) {
        if (topElement === elementToCheck) {
          return true
        }
        topElement = topElement.parentElement
      }
      return false
    }, isVisibleWithinViewport)
      .then(function (value) {
        if (value !== true) {
          throw new Error('"' + isVisibleWithinViewport +
                          '" is not visible within viewport.')
        }
      })
  }
}
