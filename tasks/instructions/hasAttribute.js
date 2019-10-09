'use strict'

const { checkSingleElement } = require('./utils/elements')

module.exports = {
  detect: function (command) {
    return !!command.hasAttribute
  },

  perform: async function (grunt, target, client, command, options) {
    const hasAttribute = command.hasAttribute
    const selector = hasAttribute.selector
    const name = hasAttribute.name
    const expected = hasAttribute.value
    grunt.log.ok('Looking for attribute "' + name + '" with value "' +
                 expected + '" at "' + selector + '".')
    if (options.singleElementSelections) {
      await checkSingleElement(client, selector)
    }
    return client.$(selector)
      .then(element => element.getAttribute(name))
      .then(function (actual) {
        if (actual != expected) { // eslint-disable-line eqeqeq
          throw new Error('Value of attribute "' + name + '" at "' +
            selector + '" was not "' + expected + '" but "' + actual + '".')
        }
      })
  }
}
