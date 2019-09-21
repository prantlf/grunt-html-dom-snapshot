'use strict'

const { findElement } = require('./utils/elements')

module.exports = {
  detect: function (command) {
    return !!command.clickIfVisible
  },

  perform: function (grunt, target, client, command) {
    const clickIfVisible = command.clickIfVisible
    grunt.output.writeln('Checking visibility of "' + clickIfVisible + '"...')
    let clickable
    return findElement(client, clickIfVisible)
      .then(element => {
        clickable = element
        return client.isElementDisplayed(element)
      })
      .then(function (value) {
        if (value === true) {
          grunt.output.writeln('Click on "' + clickIfVisible + '".')
          return client.elementClick(clickable)
        } else {
          grunt.output.writeln('"' + clickIfVisible + '" is not visible.')
        }
      })
  }
}
