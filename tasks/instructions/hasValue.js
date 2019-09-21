'use strict'

module.exports = {
  detect: function (command) {
    return !!command.hasValue
  },

  perform: function (grunt, target, client, command) {
    const hasValue = command.hasValue
    const selector = hasValue.selector
    const expected = hasValue.value
    grunt.log.ok('Comparing value of "' + selector + '" to "' +
                 expected + '".')
    return client.$(selector)
      .then(element => element.getValue())
      .then(function (actual) {
        if (actual != expected) { // eslint-disable-line eqeqeq
          throw new Error('Value of "' + selector + '" was not "' +
                           expected + '" but "' + actual + '".')
        }
      })
  }
}
