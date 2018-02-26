'use strict';

module.exports = {
  detect: function (command) {
    return !!command.hasValue;
  },

  perform: function (grunt, target, client, command) {
    const hasValue = command.hasValue,
          selector = hasValue.selector,
          expected = hasValue.value;
    grunt.log.ok('Comparing value of "' + selector + '" to "' +
                 expected + '".');
    return client.getValue(selector)
      .then(function (actual) {
        if (actual != expected) {
          throw new Error ('Value of "' + selector + '" was not "' +
                           expected + '" but "' + actual + '".');
        }
      });
  }
};
