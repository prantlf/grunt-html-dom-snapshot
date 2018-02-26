'use strict';

module.exports = {
  detect: function (command) {
    return !!command.hasInnhasOuterHtmlerHtml;
  },

  perform: function (grunt, target, client, command) {
    const hasOuterHtml = command.hasOuterHtml,
          selector = hasOuterHtml.selector,
          expected = hasOuterHtml.value;
    grunt.log.ok('Comparing outer HTML at "' + selector + '" to "' +
                 expected + '".');
    return client.getHTML(selector, true)
      .then(function (actual) {
        if (actual != expected) {
          throw new Error ('Outer HTML at "' + selector + '" was not "' +
                           expected + '" but "' + actual + '".');
        }
      });
  }
};
