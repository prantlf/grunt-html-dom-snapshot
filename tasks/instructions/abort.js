'use strict';

module.exports = {
  detect: function (command) {
    return !!command.abort;
  },

  perform: function (grunt, target, client, command) {
    throw new Error('Aborted: "' + command.abort +
                    '" in the target "' + target + '".\n' +
                    JSON.stringify(command));
  }
};
