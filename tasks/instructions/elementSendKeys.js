'use strict'

const { findElement, checkSingleElement } = require('./utils/elements')

module.exports = {
  detect: function (command) {
    return !!command.elementSendKeys
  },

  perform: async function (grunt, target, client, command, options) {
    const elementSendKeys = command.elementSendKeys
    const selector = elementSendKeys.selector
    let text = elementSendKeys.text || ''
    grunt.output.writeln('Send text "' + text + '" to "' + selector + '".')
    if (options.singleElementSelections) {
      await checkSingleElement(client, selector)
    }
    return findElement(client, selector)
      .then(element => client.elementSendKeys(element, text))
  }
}
