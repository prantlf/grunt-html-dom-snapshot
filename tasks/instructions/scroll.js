'use strict'

module.exports = {
  detect: function (command) {
    return !!command.scroll
  },

  perform: function (grunt, target, client, command) {
    let scroll = command.scroll
    if (typeof scroll === 'string') {
      scroll = { selector: scroll }
    }
    const offset = scroll.offset
    if (offset) {
      grunt.output.writeln('Move cursor to ' + JSON.stringify(offset) + '.')
      return client.scroll(offset.left, offset.top)
    }
    const selector = scroll.selector
    grunt.output.writeln('Move cursor to "' + selector + '".')
    return client.scroll(selector)
  }
}
