'use strict'

module.exports = {
  detect: function (command) {
    return !!command.selectOptionByIndex
  },

  perform: function (grunt, target, client, command) {
    const selectOptionByIndex = command.selectOptionByIndex
    const selector = selectOptionByIndex.selector
    const index = selectOptionByIndex.index
    grunt.log.ok('Selecting option with index "' + index + '" for "' +
                 selector + '".')
    return client.selectByIndex(selector, index)
  }
}
