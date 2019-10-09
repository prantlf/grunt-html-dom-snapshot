'use strict'

const { checkSingleElement } = require('./utils/elements')

module.exports = {
  detect: function (command) {
    return !!command.setValue
  },

  perform: async function (grunt, target, client, command, options) {
    const setValue = command.setValue
    const selector = setValue.selector
    const value = setValue.value
    grunt.output.writeln('Set value of "' + selector +
                          '" to "' + value + '".')
    if (options.singleElementSelections) {
      await checkSingleElement(client, selector)
    }
    return client.$(selector)
      .then(element => element.setValue(value))
  }
}
