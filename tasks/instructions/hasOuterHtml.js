'use strict'

const { checkSingleElement } = require('./utils/elements')

module.exports = {
  detect: function (command) {
    return !!command.hasOuterHtml
  },

  perform: async function (grunt, target, client, command, options) {
    const hasOuterHtml = command.hasOuterHtml
    const selector = hasOuterHtml.selector
    const expected = hasOuterHtml.value
    grunt.log.ok('Comparing outer HTML at "' + selector + '" to "' +
                 expected + '".')
    if (options.singleElementSelections) {
      await checkSingleElement(client, selector)
    }
    return client.$(selector)
      .then(element => element.getHTML(true))
      .then(function (actual) {
        if (actual != expected) { // eslint-disable-line eqeqeq
          throw new Error('Outer HTML at "' + selector + '" was not "' +
                           expected + '" but "' + actual + '".')
        }
      })
  }
}
