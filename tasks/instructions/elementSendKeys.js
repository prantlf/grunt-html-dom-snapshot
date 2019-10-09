'use strict'

const { findElement, checkSingleElement } = require('./utils/elements')

module.exports = {
  detect: function (command) {
    return !!command.elementSendKeys
  },

  perform: async function (grunt, target, client, command, options) {
    const elementSendKeys = command.elementSendKeys
    const selector = elementSendKeys.selector
    let keys = elementSendKeys.keys || []
    let text = elementSendKeys.text || ''
    const message = text
      ? 'Send text "' + text + '" to "' + selector + '".'
      : 'Send keys "' + keys.join('", "') + '" to "' + selector + '".'
    grunt.output.writeln(message)
    if (options.singleElementSelections) {
      await checkSingleElement(client, selector)
    }
    return findElement(client, selector)
      .then(element => client.elementSendKeys(element, text, keys))
  }
}
