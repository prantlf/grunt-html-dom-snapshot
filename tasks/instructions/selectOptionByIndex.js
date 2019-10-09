'use strict'

const { checkSingleElement } = require('./utils/elements')

module.exports = {
  detect: function (command) {
    return !!command.selectOptionByIndex
  },

  perform: async function (grunt, target, client, command, options) {
    const selectOptionByIndex = command.selectOptionByIndex
    const selector = selectOptionByIndex.selector
    const index = selectOptionByIndex.index
    grunt.log.ok('Selecting option with index "' + index + '" for "' +
                 selector + '".')
    if (options.singleElementSelections) {
      await checkSingleElement(client, selector)
    }
    return client.$(selector)
      .then(element => element.selectByIndex(index))
  }
}
