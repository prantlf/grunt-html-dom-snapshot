'use strict'

const { findElement } = require('./utils/elements')

module.exports = {
  detect: function (command) {
    return !!command.click
  },

  perform: function (grunt, target, client, command) {
    const click = command.click
    grunt.output.writeln('Click on "' + click + '".')
    return findElement(client, click)
      .then(element => client.elementClick(element))
  }
}
