'use strict';

module.exports = {
  detect: function (command) {
    return !!command.moveCursor;
  },

  perform: function (grunt, target, client, command) {
    var moveCursor = command.moveCursor;
    if (typeof moveCursor === 'string') {
      moveCursor = {selector: moveCursor};
    }
    const offset = moveCursor.offset || {};
    grunt.verbose.writeln('Move cursor to "' + moveCursor +
                          '", offset ' + offset + '.');
    return client.moveToObject(moveCursor.selector,
                               offset.left, offset.top);
  }
};
