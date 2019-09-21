'use strict'

module.exports = {
  detect: function (command) {
    return !!command.hasClass
  },

  perform: function (grunt, target, client, command) {
    const hasClass = command.hasClass
    const selector = hasClass.selector
    const expected = hasClass.value || ''
    const expectedList = expected.split(/ +/)
    grunt.log.ok('Looking for classes "' + expected + '" at "' +
                 selector + '".')
    return client.$(selector)
      .then(element => element.getAttribute('class'))
      .then(function (actual) {
        const actualList = (actual || '').split(/ +/)
        const method = hasClass.allRequired ? 'every' : 'some'
        if (!expectedList[method](function (expected) {
          return expected.startsWith('!')
            ? actualList.indexOf(expected.substr(1)) < 0
            : actualList.indexOf(expected) >= 0
        })) {
          throw new Error('Classes "' + expected +
            '" did not match classes "' + actual + '" at "' + selector + '".')
        }
      })
  }
}
