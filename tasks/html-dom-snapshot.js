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
      mkdirp = require('mkdirp');

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
          snapshots = options.dest;
    var lastViewport = options.viewport;
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
    const commands = data.commands || pages || [
            Object.assign({
              file: target
            }, data)
          ],
          client = webdriverio.remote({
            desiredCapabilities: options.browserCapabilities
          });
    var urlCount = 0,
        snapshotCount = 0,
        screenshotCount = 0;

    grunt.verbose.writeln('Open web browser window for the target "' +
                          target + '".');
    client.init()
          .then(setViewportSize)
          .then(function () {
            return commands.reduce(function (promise, command) {
              return promise.then(function () {
                return performCommand(command);
              });
            }, Promise.resolve());
          })
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
      const commandOptions = Object.assign({}, options, command.options || {}),
            file = command.file,
            url = command.url,
            go = command.go,
            clearValue = command.clearValue,
            setValue = command.setValue,
            addValue = command.addValue,
            click = command.click,
            viewport = commandOptions.viewport,
            screenshots = commandOptions.screenshots;
      var moveCursor = command.moveCursor,
          wait = command.wait,
          snapshots = commandOptions.dest,
          viewportSet;
      if (snapshots) {
        grunt.log.warn('The property "dest" is deprecated. ' +
                       'Use "snapshots" with the same content.');
      } else {
        snapshots = commandOptions.snapshots;
      }
      if (!(url || file || go || clearValue || setValue || addValue ||
            moveCursor || click || wait)) {
        throw new Error('Missing instruction in the command ' +
                        'in the target "' + target + '".');
      }
      if (viewport.width !== lastViewport.width ||
          viewport.height !== lastViewport.height) {
        lastViewport = viewport;
        viewportSet = setViewportSize();
      } else {
        viewportSet = Promise.resolve();
      }
      return viewportSet
        .then(function () {
          if (url) {
            grunt.log.ok('Navigate to "' + url + '".');
            ++urlCount;
            return client.url(url);
          }
        })
        .then(function () {
          if (go) {
            if (!(go === 'back' || go === 'forward' || go === 'refresh')) {
              throw new Error('Invalid target to go to: "' + go + '".');
            }
            grunt.verbose.writeln('Perform navigation: "' + go + '".');
            return client[go](url);
          }
        })
        .then(function () {
          if (clearValue) {
            grunt.verbose.writeln('Clear value of "' + clearValue + '".');
            return client.clearElement(clearValue);
          }
        })
        .then(function () {
          if (setValue) {
            const selector = setValue.selector,
                  value = setValue.value;
            grunt.verbose.writeln('Set value of "' + selector +
                                  '" to "' + value + '".');
            return client.setValue(selector, value);
          }
        })
        .then(function () {
          if (addValue) {
            const selector = addValue.selector,
                  value = addValue.value;
            grunt.verbose.writeln('Add "' + value + '" to value of "' +
                                  selector + '".');
            return client.addValue(selector, value);
          }
        })
        .then(function () {
          if (moveCursor) {
            if (typeof moveCursor === 'string') {
              moveCursor = {selector: moveCursor};
            }
            const offset = moveCursor.offset || {};
            grunt.verbose.writeln('Move cursor to "' + moveCursor +
                                  '", offset ' + offset + '.');
            return client.moveToObject(moveCursor.selector,
                                       offset.left, offset.top);
          }
        })
        .then(function () {
          if (click) {
            grunt.verbose.writeln('Click on "' + click + '".');
            return client.click(click);
          }
        })
        .then(waitForContent)
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

      function waitForContent() {
        if (!Array.isArray(wait)) {
          wait = wait ? [wait] : [];
        }
        return wait.reduce(function (promise, wait) {
          return promise.then(function () {
            if (typeof wait === 'function') {
              grunt.verbose.writeln('Wait for custom function.');
              return wait(client);
            } else if (typeof wait === 'string') {
              const timeout = commandOptions.selectorTimeout;
              if (wait.charAt(0) === '!') {
                wait = wait.substr(1);
                grunt.verbose.writeln('Wait for "' + wait +
                                      '" disappearing ' + timeout + 'ms.');
                return client.waitForExist(wait,
                  commandOptions.selectorTimeout, true);
              }
              grunt.verbose.writeln('Wait for "' + wait +
                                    '" appearing.' + timeout + 'ms.');
              return client.waitForExist(wait, timeout);
            } else if (typeof wait === 'number') {
              grunt.verbose.writeln('Wait for ' + wait + 'ms.');
              return new Promise(function (resolve) {
                setTimeout(resolve, wait);
              });
            }
          });
        }, Promise.resolve());
      }

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
