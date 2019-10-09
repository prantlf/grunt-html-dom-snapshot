'use strict'

const { checkSingleElement } = require('./utils/elements')

module.exports = {
  detect: function (command) {
    return !!command.hasText
  },

  perform: async function (grunt, target, client, command, options) {
    const hasText = command.hasText
    const selector = hasText.selector
    const expected = hasText.value
    grunt.log.ok('Comparing text at "' + selector + '" to "' +
                 expected + '".')
    if (options.singleElementSelections) {
      await checkSingleElement(client, selector)
    }
    return client.$(selector)
      .then(element => element.getText())
      .then(function (actual) {
        if (actual != expected) { // eslint-disable-line eqeqeq
          throw new Error('Text at "' + selector + '" was not "' +
                           expected + '" but "' + actual + '".')
        }
      })
  }
}
