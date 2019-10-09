'use strict'

module.exports = {
  detect: function (command) {
    return !!command.isVisibleWithinViewport
  },

  perform: function (grunt, target, client, command, options) {
    const isVisibleWithinViewport = command.isVisibleWithinViewport
    grunt.log.ok('Checking if "' + isVisibleWithinViewport +
                 '" is visible within viewport.')
    return client.execute(function (selector, checkSingleElement) {
      var elementToCheck = document.querySelector(selector)
      if (!elementToCheck) {
        return false
      }
      if (checkSingleElement) {
        var elements = document.querySelectorAll(selector)
        if (elements.length > 1) {
          throw new Error(`Multiple elements matched "${selector}".`)
        }
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
    }, isVisibleWithinViewport, options.singleElementSelections)
      .then(function (value) {
        if (value !== true) {
          throw new Error('"' + isVisibleWithinViewport +
                          '" is not visible within viewport.')
        }
      })
  }
}
