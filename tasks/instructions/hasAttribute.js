'use strict';

module.exports = {
  detect: function (command) {
    return !!command.hasAttribute;
  },

  perform: function (grunt, target, client, command) {
    const hasAttribute = command.hasAttribute,
          selector = hasAttribute.selector,
          name = hasAttribute.name,
          expected = hasAttribute.value;
    grunt.log.ok('Looking for attribute "' + name + '" with value "' +
                 expected + '" at "' + selector + '".');
    return client.getAttribute(selector, name)
      .then(function (actual) {
        if (actual != expected) {
          throw new Error ('Value of attribute "' + name + '" at "' +
            selector + '" was not "' + expected + '" but "' + actual + '".');
        }
      });
  }
};
