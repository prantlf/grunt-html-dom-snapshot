// grunt-html-dom-snapshot
// https://github.com/prantlf/grunt-html-dom-snapshot
//
// Copyright (c) 2017-2018 Ferdinand Prantl
// Licensed under the MIT license.
//
// Takes snapshots of the HTML markup on web pages - their immediate DOM
// content - and screenshots of their viewport - how they look like.

'use strict'

const fs = require('fs')
const pad = require('pad-left')
const path = require('path')
const mkdirp = require('mkdirp')
const nodeCleanup = require('node-cleanup')
const instructions = [
  'setViewport', 'url', 'go', 'clearValue', 'setValue', 'addValue',
  'selectOptionByIndex', 'selectOptionByValue', 'moveCursor',
  'click', 'keys', 'wait', 'hasAttribute', 'hasClass', 'hasValue',
  'hasText', 'hasInnerHtml', 'hasOuterHtml',
  'isEnabled', 'isExisting', 'isFocused', 'isSelected', 'isVisible',
  'isVisibleWithinViewport', 'isNotEnabled', 'isNotExisting',
  'isNotFocused', 'isNotSelected', 'isNotVisible',
  'isNotVisibleWithinViewport', 'abort'
].map(instruction => require('./instructions/' + instruction))
let fileCount = 0

module.exports = grunt => {
  grunt.registerMultiTask('html-dom-snapshot',
    'Takes snapshots of the HTML markup on web pages - their immediate DOM content - and screenshots of their viewport - how they look like.',
    function () {
      const webdriverio = require('webdriverio')
      const done = this.async()
      const data = this.data
      const options = this.options({
        webdriver: {
          desiredCapabilities: {
            browserName: 'chrome',
            chromeOptions: {
              args: ['--headless']
            }
          }
        },
        viewport: {
          width: 1024,
          height: 768
        },
        selectorTimeout: 10000,
        doctype: '<!DOCTYPE html>',
        snapshots: 'snapshots',
        fileNumbering: false,
        fileNumberDigits: 3,
        fileNumberSeparator: '.',
        force: false
      })
      const target = this.target
      const pages = data.pages
      const snapshots = options.dest
      const viewport = options.viewport
      const webdriver = options.webdriver
      const browserCapabilities = options.browserCapabilities
      const lastViewport = {
        width: viewport.width,
        height: viewport.height
      }
      let urlCount = 0
      let snapshotCount = 0
      let screenshotCount = 0
      let commands
      if (browserCapabilities) {
        grunt.log.warn('The property "browserCapabilities" is deprecated. ' +
                      'Use "webdriver.desiredCapabilities" with the same content.')
        webdriver.desiredCapabilities = browserCapabilities
        delete options.browserCapabilities
      }
      if (pages) {
        grunt.log.warn('The property "pages" is deprecated. ' +
                      'Use "commands" with the same content.')
      }
      if (snapshots) {
        grunt.log.warn('The property "dest" is deprecated. ' +
                      'Use "snapshots" with the same content.')
        options.snapshots = snapshots
        delete options.dest
      }

      grunt.verbose.writeln('Open web browser window for the target "' +
                            target + '".')
      let client = webdriverio.remote(webdriver)
      client.init()
            .then(() => nodeCleanup(stop))
            .then(setViewportSize)
            .then(gatherCommands)
            .then(performCommands)
            .then(() => {
              grunt.log.ok(commands.length + ' ' +
                  grunt.util.pluralize(commands.length, 'command/commands') +
                  ' performed, ' + urlCount + ' ' +
                  grunt.util.pluralize(urlCount, 'page/pages') +
                  ' visited, ' + snapshotCount + ' ' +
                  grunt.util.pluralize(snapshotCount, 'snapshot/snapshots') +
                  ' and ' + screenshotCount + ' ' +
                  grunt.util.pluralize(screenshotCount, 'screenshot/screenshots') +
                  ' written.')
              return stop()
            })
            .catch(error => {
              grunt.verbose.error(error.stack)
              grunt.log.error(error)
              const warn = options.force ? grunt.log.warn : grunt.fail.warn
              warn('Taking snapshots failed.')
              return stop()
            })
            .then(done)

      function stop () {
        if (client) {
          const backup = client
          client = null
          return backup.end()
            // Workaround for hanging chromedriver; for more information
            // see https://github.com/vvo/selenium-standalone/issues/351
            .pause(100)
        }
      }

      function gatherCommands () {
        let scenarios = data.scenarios
        commands = data.commands || pages
        if (scenarios) {
          if (!Array.isArray(scenarios)) {
            scenarios = [scenarios]
          }
          const currentDirectory = process.cwd()
          commands = scenarios
            .reduce((scenarios, scenario) =>
              scenarios.concat(grunt.file.expand(scenario)), [])
            .reduce((scenarios, scenario) => {
              grunt.verbose.writeln('Load scenario  "' + scenario + '".')
              if (!path.isAbsolute(scenario)) {
                scenario = path.join(currentDirectory, scenario)
              }
              return scenarios.concat(require(scenario))
            }, commands || [])
        }
        if (!commands) {
          commands = [
            Object.assign({
              file: target
            }, data)
          ]
        }
      }

      function performCommands () {
        return commands.reduce((promise, command) =>
          promise.then(() => performCommand(command)), Promise.resolve())
      }

      function setViewportSize () {
        grunt.verbose.writeln('Resize viewport to ' + lastViewport.width +
                              'x' + lastViewport.height + '.')
        return client.setViewportSize(lastViewport)
      }

      function ensureDirectory (name) {
        return new Promise((resolve, reject) =>
          mkdirp(name, error => {
            if (error) {
              reject(error)
            } else {
              resolve()
            }
          }))
      }

      function performCommand (command) {
        const commandOptions = Object.assign({
          lastViewport: lastViewport
        }, options, command.options || {})
        const file = command.file
        const fileNumbering = commandOptions.fileNumbering
        const fileNumberDigits = commandOptions.fileNumberDigits
        const fileNumberSeparator = commandOptions.fileNumberSeparator
        const viewport = commandOptions.viewport
        const screenshots = commandOptions.screenshots
        const commandInstructions = instructions.map(instruction => {
          return {
            perform: instruction.perform,
            detected: instruction.detect(command)
          }
        })
        let snapshots = commandOptions.dest
        let viewportSet
        if (snapshots) {
          grunt.log.warn('The property "dest" is deprecated. ' +
                        'Use "snapshots" with the same content.')
        } else {
          snapshots = commandOptions.snapshots
        }
        if (!(commandInstructions.some(instruction => instruction.detected) || file)) {
          throw new Error('Missing instruction in the command ' +
                          'in the target "' + target + '".\n' +
                          JSON.stringify(command))
        }
        if ((viewport.width !== lastViewport.width ||
            viewport.height !== lastViewport.height) && !lastViewport.explicit) {
          lastViewport.width = viewport.width
          lastViewport.height = viewport.height
          viewportSet = setViewportSize()
        } else {
          viewportSet = Promise.resolve()
        }
        if (command.url) {
          ++urlCount
        }
        return commandInstructions.reduce((previous, instruction) =>
          previous.then(() => {
            const detected = instruction.detected
            if (detected) {
              return instruction.perform(grunt, target, client, command,
                                        commandOptions, detected)
            }
          }), viewportSet)
        .then(() => {
          if (snapshots && screenshots) {
            ++fileCount
            return Promise.all([makeSnapshot(), makeScreenshot()])
          }
          if (snapshots) {
            ++fileCount
            return makeSnapshot()
          }
          if (screenshots) {
            ++fileCount
            return makeScreenshot()
          }
        })

        function makeSnapshot () {
          return client.getHTML('html')
                      .then(saveContent)
        }

        function makeScreenshot () {
          return client.screenshot()
                      .then(saveImage)
        }

        function saveContent (html) {
          if (file) {
            let fileName = file.toLowerCase()
            fileName = fileName.endsWith('.html') ||
                      fileName.endsWith('.htm') ? file : file + '.html'
            if (fileNumbering) {
              fileName = numberFileName(fileName)
            }
            fileName = path.join(snapshots, fileName)
            grunt.log.ok('Write snapshot to "' + fileName + '".')
            return ensureDirectory(snapshots)
              .then(() => new Promise((resolve, reject) =>
                fs.writeFile(fileName, commandOptions.doctype + html,
                  error => {
                    if (error) {
                      reject(error)
                    } else {
                      ++snapshotCount
                      resolve()
                    }
                  })
              ))
          }
        }

        function saveImage (png) {
          if (file) {
            let fileName = file.toLowerCase()
            fileName = fileName.endsWith('.html')
                       ? file.substr(0, file.length - 5)
                       : fileName.endsWith('.htm')
                       ? file.substr(0, file.length - 4) : file
            if (fileNumbering) {
              fileName = numberFileName(fileName)
            }
            fileName = path.join(screenshots, fileName + '.png')
            grunt.log.ok('Write screenshot to "' + fileName + '".')
            return ensureDirectory(screenshots)
              .then(() => new Promise((resolve, reject) =>
                fs.writeFile(fileName, Buffer.from(png.value, 'base64'),
                  error => {
                    if (error) {
                      reject(error)
                    } else {
                      ++screenshotCount
                      resolve()
                    }
                  })
              ))
          }
        }

        function numberFileName (fileName) {
          return pad(fileCount.toString(), fileNumberDigits, '0') +
                fileNumberSeparator + fileName
        }
      }
    })
}
