'use strict'

module.exports = {
  detect: function (command) {
    return !!command.isNotVisibleWithinViewport
  },

  perform: function (grunt, target, client, command) {
    const isNotVisibleWithinViewport = command.isNotVisibleWithinViewport
    grunt.log.ok('Checking if "' + isNotVisibleWithinViewport +
                 '" is not visible within viewport.')
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
    }, isNotVisibleWithinViewport)
      .then(function (value) {
        if (value !== false) {
          throw new Error('"' + isNotVisibleWithinViewport +
                          '" is visible within viewport.')
        }
      })
  }
}
