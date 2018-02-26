'use strict';

module.exports = {
  detect: function (command) {
    return !!command.isEnabled;
  },

  perform: function (grunt, target, client, command) {
    const isEnabled = command.isEnabled;
    grunt.log.ok('Checking if "' + isEnabled + '" is enabled.');
    return client.isEnabled(isEnabled)
      .then(function (value) {
        if (value !== true) {
          throw new Error ('"' + isEnabled + '" is not enabled.');
        }
      });
  }
};
