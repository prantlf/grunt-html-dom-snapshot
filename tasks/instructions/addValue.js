'use strict'

module.exports = {
  detect: function (command) {
    return !!command.addValue
  },

  perform: function (grunt, target, client, command) {
    const addValue = command.addValue
    const selector = addValue.selector
    const value = addValue.value
    grunt.output.writeln('Add "' + value + '" to value of "' +
                          selector + '".')
    return client.$(selector)
      .then(element => element.addValue(value))
  }
}
