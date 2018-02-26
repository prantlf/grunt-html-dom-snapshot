'use strict';

module.exports = {
  detect: function (command) {
    return !!command.hasInnerHtml;
  },

  perform: function (grunt, target, client, command) {
    const hasInnerHtml = command.hasInnerHtml,
          selector = hasInnerHtml.selector,
          expected = hasInnerHtml.value;
    grunt.log.ok('Comparing inner HTML at "' + selector + '" to "' +
                 expected + '".');
    return client.getHTML(selector, false)
      .then(function (actual) {
        if (actual != expected) {
          throw new Error ('Inner HTML at "' + selector + '" was not "' +
                           expected + '" but "' + actual + '".');
        }
      });
  }
};
