'use strict'

const { checkSingleElement } = require('./utils/elements')

module.exports = {
  detect: function (command) {
    return !!command.hasInnerHtml
  },

  perform: async function (grunt, target, client, command, options) {
    const hasInnerHtml = command.hasInnerHtml
    const selector = hasInnerHtml.selector
    const expected = hasInnerHtml.value
    grunt.log.ok('Comparing inner HTML at "' + selector + '" to "' +
                 expected + '".')
    if (options.singleElementSelections) {
      await checkSingleElement(client, selector)
    }
    return client.$(selector)
      .then(element => element.getHTML(false))
      .then(function (actual) {
        if (actual != expected) { // eslint-disable-line eqeqeq
          throw new Error('Inner HTML at "' + selector + '" was not "' +
                           expected + '" but "' + actual + '".')
        }
      })
  }
}
