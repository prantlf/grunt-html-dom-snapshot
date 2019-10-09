'use strict'

const { checkSingleElement } = require('./utils/elements')

module.exports = {
  detect: function (command) {
    return !!command.scroll
  },

  perform: async function (grunt, target, client, command, options) {
    let scroll = command.scroll
    if (typeof scroll === 'string') {
      scroll = { selector: scroll }
    }
    if (scroll.offset) {
      throw new Error('Scrolling to an offset is not supported.')
    }
    const selector = scroll.selector
    grunt.output.writeln('Scroll to "' + selector + '".')
    if (options.singleElementSelections) {
      await checkSingleElement(client, selector)
    }
    return client.$(selector)
      .then(element => element.scrollIntoView())
  }
}
