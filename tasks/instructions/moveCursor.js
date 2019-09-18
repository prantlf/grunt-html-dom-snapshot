'use strict'

module.exports = {
  detect: function (command) {
    return !!command.moveCursor
  },

  perform: function (grunt, target, client, command) {
    let moveCursor = command.moveCursor
    if (typeof moveCursor === 'string') {
      moveCursor = { selector: moveCursor }
    }
    const selector = moveCursor.selector
    const offset = moveCursor.offset || {}
    grunt.output.writeln('Move cursor to "' + selector +
                          '", offset ' + JSON.stringify(offset) + '.')
    return client.moveToObject(selector, offset.left, offset.top)
  }
}
