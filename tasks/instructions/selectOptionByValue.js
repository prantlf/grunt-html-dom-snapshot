'use strict'

const { checkSingleElement } = require('./utils/elements')

module.exports = {
  detect: function (command) {
    return !!command.selectOptionByValue
  },

  perform: async function (grunt, target, client, command, options) {
    const selectOptionByValue = command.selectOptionByValue
    const selector = selectOptionByValue.selector
    const value = selectOptionByValue.value
    grunt.log.ok('Selecting option with value "' + value + '" for "' +
                 selector + '".')
    if (options.singleElementSelections) {
      await checkSingleElement(client, selector)
    }
    return client.$(selector)
      .then(element => element.selectByAttribute('value', value))
  }
}
