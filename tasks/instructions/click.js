'use strict'

const { findElement, checkSingleElement } = require('./utils/elements')

module.exports = {
  detect: function (command) {
    return !!command.click
  },

  perform: async function (grunt, target, client, command, options) {
    const click = command.click
    grunt.output.writeln('Click on "' + click + '".')
    if (options.singleElementSelections) {
      await checkSingleElement(client, click)
    }
    return findElement(client, click)
      .then(element => client.elementClick(element))
  }
}
