'use strict'

const { checkSingleElement } = require('./utils/elements')

module.exports = {
  detect: function (command) {
    return !!command.moveCursor
  },

  perform: async function (grunt, target, client, command, options) {
    let moveCursor = command.moveCursor
    if (typeof moveCursor === 'string') {
      moveCursor = { selector: moveCursor }
    }
    const selector = moveCursor.selector
    const offset = moveCursor.offset || {}
    grunt.output.writeln('Move cursor to "' + selector +
                          '", offset ' + JSON.stringify(offset) + '.')
    if (options.singleElementSelections) {
      await checkSingleElement(client, selector)
    }
    return client.$(selector)
      .then(element => element.moveTo({ xOffset: offset.left, yOffset: offset.top }))
  }
}
