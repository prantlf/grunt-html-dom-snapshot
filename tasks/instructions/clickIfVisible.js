'use strict'

module.exports = {
  detect: function (command) {
    return !!command.clickIfVisible
  },

  perform: function (grunt, target, client, command) {
    console.log('target "' + target + '".')
    const clickIfVisible = command.clickIfVisible
    grunt.verbose.writeln('Click on "' + clickIfVisible + '" if visible.')
    client.isVisible(clickIfVisible).then(function (value) {
      if (value === true) {
        grunt.verbose.writeln('Visible: "' + clickIfVisible + '".')
        return client.click(clickIfVisible)
      } else {
        grunt.verbose.writeln('Not visible: "' + clickIfVisible + '".')
      }
    })
  }
}
