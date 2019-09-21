'use strict'

module.exports = {
  detect: function (command) {
    return !!command.selectOptionByValue
  },

  perform: function (grunt, target, client, command) {
    const selectOptionByValue = command.selectOptionByValue
    const selector = selectOptionByValue.selector
    const value = selectOptionByValue.value
    grunt.log.ok('Selecting option with value "' + value + '" for "' +
                 selector + '".')
    return client.$(selector)
      .then(element => element.selectByAttribute('value', value))
  }
}
