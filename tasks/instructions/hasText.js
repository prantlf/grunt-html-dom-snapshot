'use strict';

module.exports = {
  detect: function (command) {
    return !!command.hasText;
  },

  perform: function (grunt, target, client, command) {
    const hasText = command.hasText,
          selector = hasText.selector,
          expected = hasText.value;
    grunt.log.ok('Comparing text at "' + selector + '" to "' +
                 expected + '".');
    return client.getText(selector)
      .then(function (actual) {
        if (actual != expected) {
          throw new Error ('Text at "' + selector + '" was not "' +
                           expected + '" but "' + actual + '".');
        }
      });
  }
};
