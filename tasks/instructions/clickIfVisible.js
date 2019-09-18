'use strict'

module.exports = {
  detect: function (command) {
    return !!command.clickIfVisible
  },

  perform: function (grunt, target, client, command) {
    const clickIfVisible = command.clickIfVisible
    grunt.output.writeln('Checking visibility of "' + clickIfVisible + '"...')
    client.isVisible(clickIfVisible).then(function (value) {
      if (value === true) {
        grunt.output.writeln('Click on "' + clickIfVisible + '".')
        return client.click(clickIfVisible)
      } else {
        grunt.output.writeln('"' + clickIfVisible + '" is not visible.')
      }
    })
  }
}
