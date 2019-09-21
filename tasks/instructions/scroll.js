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
    if (scroll.offset) {
      throw new Error('Scrolling to an offset is not supported.')
    }
    const selector = scroll.selector
    grunt.output.writeln('Scroll to "' + selector + '".')
    return client.$(selector)
      .then(element => element.scrollIntoView())
  }
}
