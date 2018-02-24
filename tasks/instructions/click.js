'use strict';

module.exports = {
  detect: function (command) {
    return !!command.click;
  },

  perform: function (grunt, target, client, command) {
    const click = command.click;
    grunt.verbose.writeln('Click on "' + click + '".');
    return client.click(click);
  }
};
