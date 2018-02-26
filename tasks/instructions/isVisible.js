'use strict';

module.exports = {
  detect: function (command) {
    return !!command.isVisible;
  },

  perform: function (grunt, target, client, command) {
    const isVisible = command.isVisible;
    grunt.log.ok('Checking if "' + isVisible + '" is visible.');
    return client.isVisible(isVisible)
      .then(function (value) {
        if (value !== true) {
          throw new Error ('"' + isVisible + '" is not visible.');
        }
      });
  }
};
