'use strict'

const { findElement } = require('./utils/elements')

module.exports = {
  detect: function (command) {
    return !!command.elementSendKeys
  },

  perform: function (grunt, target, client, command) {
    const elementSendKeys = command.elementSendKeys
    const selector = elementSendKeys.selector
    let keys = elementSendKeys.keys || []
    let text = elementSendKeys.text || ''
    // const separateKeys = Array.isArray(keys)
    const message = text
      ? 'Send text "' + text + '" to "' + selector + '".'
      : 'Send keys "' + keys.join('", "') + '" to "' + selector + '".'
    // if (!separateKeys) {
    //   keys = keys.split('')
    // }
    grunt.output.writeln(message)
    return findElement(client, selector)
      .then(element => client.elementSendKeys(element, text, keys))
  }
}
