'use strict'

module.exports = {
  detect: function (command) {
    return !!command.clickIfVisible;
  },

  perform: function (grunt, target, client, command) {
    console.log('target "' + target + '".');
    const clickIfVisible = command.clickIfVisible;
   client.isVisible(clickIfVisible).then(function(value) {
     if (value === true) {
        grunt.verbose.writeln('ClickIfVisible on "' + clickIfVisible + '".');
        return client.click(clickIfVisible);
      }else{
        grunt.verbose.writeln('ClickIfVisible on "' + clickIfVisible + '" skipped because control is not visible.');

      }
    });
  }
}
