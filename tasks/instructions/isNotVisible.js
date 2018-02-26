'use strict';

module.exports = {
  detect: function (command) {
    return !!command.isNotVisible;
  },

  perform: function (grunt, target, client, command) {
    const isNotVisible = command.isNotVisible;
    grunt.log.ok('Checking if "' + isNotVisible + '" is not visible.');
    return client.isVisible(isNotVisible)
      .then(function (value) {
        if (value !== false) {
          throw new Error ('"' + isNotVisible + '" is visible.');
        }
      });
  }
};
