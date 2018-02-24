'use strict';

module.exports = {
  detect: function (command) {
    return !!command.addValue;
  },

  perform: function (grunt, target, client, command) {
    const addValue = command.addValue,
          selector = addValue.selector,
          value = addValue.value;
    grunt.verbose.writeln('Add "' + value + '" to value of "' +
                          selector + '".');
    return client.addValue(selector, value);
  }
};
