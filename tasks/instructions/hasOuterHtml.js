'use strict'

module.exports = {
  detect: function (command) {
    return !!command.hasOuterHtml
  },

  perform: function (grunt, target, client, command) {
    const hasOuterHtml = command.hasOuterHtml
    const selector = hasOuterHtml.selector
    const expected = hasOuterHtml.value
    grunt.log.ok('Comparing outer HTML at "' + selector + '" to "' +
                 expected + '".')
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
