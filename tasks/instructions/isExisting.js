'use strict';

module.exports = {
  detect: function (command) {
    return !!command.isExisting;
  },

  perform: function (grunt, target, client, command) {
    const isExisting = command.isExisting;
    grunt.log.ok('Checking if "' + isExisting + '" exists.');
    return client.isExisting(isExisting)
      .then(function (value) {
        if (value !== true) {
          throw new Error ('"' + isExisting + '" does not exist.');
        }
      });
  }
};
