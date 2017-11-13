// grunt-html-dom-snapshot
// https://github.com/prantlf/grunt-html-dom-snapshot
//
// Copyright (c) 2017 Ferdinand Prantl
// Licensed under the MIT license.
//
// Takes snapshots of the HTML markup on web pages - their immediate DOM content.

'use strict';

const fs = require('fs'),
      path = require('path'),
      mkdirp = require('mkdirp');

module.exports = function (grunt) {
  grunt.registerMultiTask('html-dom-snapshot',
      'Takes snapshots of the HTML markup on web pages - their immediate DOM content.', function () {
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
            dest: 'snapshots',
            force: false
          }),
          pages = data.pages || [
            Object.assign({
              file: this.target
            }, data)
          ],
          client = webdriverio.remote({
            desiredCapabilities: options.browserCapabilities
          });

      client.init()
            .then(function () {
              return pages.reduce(function (promise, page) {
                return promise.then(function () {
                  return takeSnapshot(page);
                });
              }, Promise.resolve());
            })
            .then(function () {
              grunt.log.ok(pages.length + ' snapshot(s) created.');
              return client.end();
            })
            .catch(function (error) {
              grunt.verbose.error(error.stack);
              grunt.log.error(error);
              const warn = options.force ? grunt.log.warn : grunt.fail.warn;
              warn('Taking snapshot(s) failed.');
            })
            .then(done);

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

    function takeSnapshot(page) {
      const url = page.url,
            pageOptions = Object.assign({}, options, page.options || {});
      grunt.verbose.writeln('Taking a snapshot of ' + url + '...');
      return client.setViewportSize(pageOptions.viewport)
        .then(function () {
          return client.url(url);
        })
        .then(waitForContent)
        .then(function () {
          return client.getHTML('html');
        })
        .then(saveContent);

      function waitForContent() {
        var wait = page.wait;
        if (!Array.isArray(wait)) {
          wait = [wait];
        }
        return wait.reduce(function (promise, wait) {
          return promise.then(function () {
            if (typeof wait === 'function') {
              return wait(client);
            } else if (typeof wait === 'string') {
              if (wait.charAt(0) === '!') {
                return client.waitForExist(wait.substr(1).trim(),
                    pageOptions.selectorTimeout, true);
              }
              return client.waitForExist(wait, pageOptions.selectorTimeout);
            } else if (typeof wait === 'number') {
              return new Promise(function (resolve) {
                setTimeout(resolve, wait);
              });
            }
          });
        }, Promise.resolve());
      }

      function saveContent(html) {
        const dest = pageOptions.dest,
              target = path.join(dest, page.file);
        grunt.verbose.writeln('Writing the snapshot to ' + target + '...');
        return ensureDirectory(dest)
          .then(function () {
            return new Promise(function (resolve, reject) {
              fs.writeFile(target, pageOptions.doctype + html, function (error) {
                if (error) {
                  reject(error);
                } else {
                  resolve();
                }
              });
            });
          });
      }
    }
  });
};
