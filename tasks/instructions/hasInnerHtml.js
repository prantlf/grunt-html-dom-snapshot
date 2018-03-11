'use strict'

module.exports = {
  detect: function (command) {
    return !!command.hasInnerHtml
  },

  perform: function (grunt, target, client, command) {
    const hasInnerHtml = command.hasInnerHtml
    const selector = hasInnerHtml.selector
    const expected = hasInnerHtml.value
    grunt.log.ok('Comparing inner HTML at "' + selector + '" to "' +
                 expected + '".')
    return client.getHTML(selector, false)
      .then(function (actual) {
        if (actual != expected) { // eslint-disable-line eqeqeq
          throw new Error('Inner HTML at "' + selector + '" was not "' +
                           expected + '" but "' + actual + '".')
        }
      })
  }
}
