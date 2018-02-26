// grunt-html-dom-snapshot
// https://github.com/prantlf/grunt-html-dom-snapshot
//
// Copyright (c) 2017-2018 Ferdinand Prantl
// Licensed under the MIT license.
//
// Takes snapshots of the HTML markup on web pages - their immediate DOM
// content - and screenshots of their viewport - how they look like.

'use strict';

const fs = require('fs'),
      path = require('path'),
      mkdirp = require('mkdirp'),
      instructions = [
        'setViewport', 'url', 'go', 'clearValue', 'setValue', 'addValue',
        'selectOptionByIndex', 'selectOptionByValue', 'moveCursor',
        'click', 'keys', 'wait', 'hasAttribute', 'hasClass', 'hasValue',
        'hasText', 'hasInnerHtml', 'hasOuterHtml',
        'isEnabled', 'isExisting', 'isFocused', 'isSelected', 'isVisible',
        'isVisibleWithinViewport', 'isNotEnabled', 'isNotExisting',
        'isNotFocused', 'isNotSelected', 'isNotVisible',
        'isNotVisibleWithinViewport'
      ].map(function (instruction) {
        return require('./instructions/' + instruction);
      });

module.exports = function (grunt) {
  grunt.registerMultiTask('html-dom-snapshot',
      'Takes snapshots of the HTML markup on web pages - their immediate DOM content - and screenshots of their viewport - how they look like.', function () {
    const webdriverio = require('webdriverio'),
          done = this.async(),
          data = this.data,
          options = this.options({
            browserCapabilities: {
              browserName: 'chrome',
              chromeOptions: {
                args: ['--headless']
              }
            },
            viewport: {
              width: 1024,
              height: 768
            },
            selectorTimeout: 10000,
            doctype: '<!DOCTYPE html>',
            snapshots: 'snapshots',
            force: false
          }),
          target = this.target,
          pages = data.pages,
          snapshots = options.dest,
          viewport = options.viewport,
          lastViewport = {
            width: viewport.width,
            height: viewport.height
          },
          client = webdriverio.remote({
            desiredCapabilities: options.browserCapabilities
          });
    var urlCount = 0,
        snapshotCount = 0,
        screenshotCount = 0,
        commands;
    if (pages) {
      grunt.log.warn('The property "pages" is deprecated. ' +
                     'Use "commands" with the same content.');
    }
    if (snapshots) {
      grunt.log.warn('The property "dest" is deprecated. ' +
                     'Use "snapshots" with the same content.');
      options.snapshots = snapshots;
      delete options.dest;
    }

    grunt.verbose.writeln('Open web browser window for the target "' +
                          target + '".');
    client.init()
          .then(setViewportSize)
          .then(gatherCommands)
          .then(performCommands)
          .then(function () {
            grunt.log.ok(commands.length + ' ' +
                grunt.util.pluralize(commands.length, 'command/commands') +
                ' performed, ' + urlCount + ' ' +
                grunt.util.pluralize(urlCount, 'page/pages') +
                ' visited, ' + snapshotCount + ' ' +
                grunt.util.pluralize(snapshotCount, 'snapshot/snapshots') +
                ' and ' + screenshotCount + ' ' +
                grunt.util.pluralize(screenshotCount, 'screenshot/screenshots') +
                ' written.');
            return client.end();
          })
          .catch(function (error) {
            grunt.verbose.error(error.stack);
            grunt.log.error(error);
            const warn = options.force ? grunt.log.warn : grunt.fail.warn;
            warn('Taking snapshots failed.');
          })
          .then(done);

    function gatherCommands() {
      let scenarios = data.scenarios;
      commands = data.commands || pages;
      if (scenarios) {
        if (!Array.isArray(scenarios)) {
          scenarios = [scenarios];
        }
        const currentDirectory = process.cwd();
        commands = scenarios
          .reduce(function (scenarios, scenario) {
            return scenarios.concat(grunt.file.expand(scenario));
          }, [])
          .reduce(function (scenarios, scenario) {
            grunt.verbose.writeln('Load scenario  "' + scenario + '".');
            if (!path.isAbsolute(scenario)) {
              scenario = path.join(currentDirectory, scenario);
            }
            return scenarios.concat(require(scenario));
          }, commands || []);
      }
      if (!commands) {
        commands = [
          Object.assign({
            file: target
          }, data)
        ];
      }
    }

    function performCommands() {
      return commands.reduce(function (promise, command) {
        return promise.then(function () {
          return performCommand(command);
        });
      }, Promise.resolve());
    }

    function setViewportSize() {
      grunt.verbose.writeln('Resize viewport to ' + lastViewport.width +
                            'x' + lastViewport.height + '.');
      return client.setViewportSize(lastViewport);
    }

    function ensureDirectory(name) {
      return new Promise(function (resolve, reject) {
        mkdirp(name, function (error) {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
    }

    function performCommand(command) {
      const commandOptions = Object.assign({
              lastViewport: lastViewport
            }, options, command.options || {}),
            file = command.file,
            viewport = commandOptions.viewport,
            screenshots = commandOptions.screenshots,
            commandInstructions = instructions.map(function (instruction) {
              return {
                perform: instruction.perform,
                detected: instruction.detect(command)
              };
            });
      var snapshots = commandOptions.dest,
          viewportSet;
      if (snapshots) {
        grunt.log.warn('The property "dest" is deprecated. ' +
                       'Use "snapshots" with the same content.');
      } else {
        snapshots = commandOptions.snapshots;
      }
      if (!(commandInstructions.some(function (instruction) {
              return instruction.detected;
            }) || file)) {
        throw new Error('Missing instruction in the command ' +
                        'in the target "' + target + '".\n' +
                        JSON.stringify(command));
      }
      if ((viewport.width !== lastViewport.width ||
          viewport.height !== lastViewport.height) && !lastViewport.explicit) {
        lastViewport.width = viewport.width;
        lastViewport.height = viewport.height;
        viewportSet = setViewportSize();
      } else {
        viewportSet = Promise.resolve();
      }
      if (command.url) {
        ++urlCount;
      }
      return commandInstructions.reduce(function (previous, instruction) {
          return previous.then(function () {
            const detected = instruction.detected;
            if (detected) {
              return instruction.perform(grunt, target, client, command,
                                         commandOptions, detected);
            }
          });
        }, viewportSet)
        .then(function () {
          if (snapshots && screenshots) {
            return Promise.all([makeSnapshot(), makeScreenshot()]);
          }
          if (snapshots) {
            return makeSnapshot();
          }
          if (screenshots) {
            return makeScreenshot();
          }
        });

      function makeSnapshot() {
        return client.getHTML('html')
                     .then(saveContent);
      }

      function makeScreenshot() {
        return client.screenshot()
                     .then(saveImage);
      }

      function saveContent(html) {
        if (file) {
          const testFile = file.toLowerCase(),
                htmlFile = testFile.endsWith('.html') ||
                           testFile.endsWith('.htm') ? file : file + '.html',
                target = path.join(snapshots, htmlFile);
          grunt.log.ok('Write snapshot to "' + target + '".');
          return ensureDirectory(snapshots)
            .then(function () {
              return new Promise(function (resolve, reject) {
                fs.writeFile(target, commandOptions.doctype + html, function (error) {
                  if (error) {
                    reject(error);
                  } else {
                    ++snapshotCount;
                    resolve();
                  }
                });
              });
            });
        }
      }

      function saveImage(png) {
        if (file) {
          const testFile = file.toLowerCase(),
                baseFile = testFile.endsWith('.html') ?
                           file.substr(0, file.length - 5) :
                           testFile.endsWith('.htm') ?
                           file.substr(0, file.length - 4) : file,
                target = path.join(screenshots, baseFile + '.png');
          grunt.log.ok('Write screenshot to "' + target + '".');
          return ensureDirectory(screenshots)
            .then(function () {
              return new Promise(function (resolve, reject) {
                fs.writeFile(target, new Buffer(png.value, 'base64'), function (error) {
                  if (error) {
                    reject(error);
                  } else {
                    ++screenshotCount;
                    resolve();
                  }
                });
              });
            });
        }
      }
    }
  });
};
