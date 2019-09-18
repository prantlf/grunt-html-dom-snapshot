'use strict'

module.exports = {
  detect: function (command) {
    return !!command.setViewport
  },

  perform: function (grunt, target, client, command, options) {
    const lastViewport = options.lastViewport
    let setViewport = command.setViewport
    let prefix
    if (!(setViewport.width && setViewport.height)) {
      prefix = 'original '
      setViewport = options.viewport
    } else {
      prefix = ''
    }
    if (setViewport.width === lastViewport.width &&
        setViewport.height === lastViewport.height) {
      grunt.output.writeln('Retaining ' + prefix + 'viewport size ' +
        setViewport.width + 'x' + setViewport.height + '.')
      return Promise.resolve()
    }
    grunt.output.writeln('Resize viewport to ' + prefix +
      setViewport.width + 'x' + setViewport.height + '.')
    lastViewport.width = setViewport.width
    lastViewport.height = setViewport.height
    lastViewport.explicit = true
    return client.setViewportSize(setViewport)
  }
}
