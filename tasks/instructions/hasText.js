'use strict'

module.exports = {
  detect: function (command) {
    return !!command.hasText
  },

  perform: function (grunt, target, client, command) {
    const hasText = command.hasText
    const selector = hasText.selector
    const expected = hasText.value
    grunt.log.ok('Comparing text at "' + selector + '" to "' +
                 expected + '".')
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
