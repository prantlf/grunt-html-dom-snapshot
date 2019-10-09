'use strict'

const { checkSingleElement } = require('./utils/elements')

module.exports = {
  detect: function (command) {
    return !!command.addValue
  },

  perform: async function (grunt, target, client, command, options) {
    const addValue = command.addValue
    const selector = addValue.selector
    const value = addValue.value
    grunt.output.writeln('Add "' + value + '" to value of "' +
                          selector + '".')
    if (options.singleElementSelections) {
      await checkSingleElement(client, selector)
    }
    return client.$(selector)
      .then(element => element.addValue(value))
  }
}
