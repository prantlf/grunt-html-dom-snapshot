'use strict';

module.exports = {
  detect: function (command) {
    return !!command.selectOptionByValue;
  },

  perform: function (grunt, target, client, command) {
    const selectOptionByValue = command.selectOptionByValue,
          selector = selectOptionByValue.selector,
          value = selectOptionByValue.value;
    grunt.log.ok('Selecting option with value "' + value + '" for "' +
                 selector + '".');
    return client.selectByValue(selector, value);
  }
};
