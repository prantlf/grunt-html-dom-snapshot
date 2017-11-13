'use strict';

module.exports = function (grunt) {
  require('time-grunt')(grunt);

  grunt.initConfig({
    eslint: {
      target: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ]
	},

    nodeunit: {
      tests: ['test/*.js']
    },

    connect: {
      server: {
        options: {
          port: 8881
        }
      }
    },

    clean: {
      snapshots: ['test/snapshots/*']
    },

    'html-dom-snapshot': {
      options: {
        browserCapabilities: {
          browserName: 'phantomjs'
        },
        dest: 'test/snapshots'
      },
      'single-target.html': {
        url: 'http://localhost:8881/test/pages/single-target.html',
      },
      others: {
        pages: [
          {
            file: 'static.html',
            url: 'http://localhost:8881/test/pages/static.html'
          },
          {
            file: 'delayed.html',
            url: 'http://localhost:8881/test/pages/delayed.html',
            wait: 200
          },
          {
            file: 'dynamic.html',
            url: 'http://localhost:8881/test/pages/dynamic.html',
            wait: '.dynamic'
          },
          {
            file: 'dynamic-reverse.html',
            url: 'http://localhost:8881/test/pages/dynamic-reverse.html',
            wait: '!.dynamic'
          },
          {
            file: 'dynamic-delayed.html',
            url: 'http://localhost:8881/test/pages/dynamic-delayed.html',
            wait: [
              '.dynamic',
              200
            ]
          },
          {
            file: 'dynamic-custom.html',
            url: 'http://localhost:8881/test/pages/dynamic-custom.html',
            wait: function (browser) {
              return browser.waitForExist('.dynamic', 1000);
            }
          },
          {
            options: {
              doctype: ''
            },
            file: 'no-doctype.html',
            url: 'http://localhost:8881/test/pages/no-doctype.html'
          }
        ]
      }
    },

    'selenium_standalone': {
      serverConfig: {
        seleniumVersion: '3.7.1',
        seleniumDownloadURL: 'http://selenium-release.storage.googleapis.com',
        drivers: {
          phantomjs: { // https://bitbucket.org/ariya/phantomjs/downloads/
            version: '2.1.1'
          }
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-selenium-standalone');
  grunt.loadTasks('tasks');

  grunt.registerTask('default', [
    'eslint', 'selenium_standalone:serverConfig:install',
    'selenium_standalone:serverConfig:start',
    'connect', 'clean', 'html-dom-snapshot', 'nodeunit',
    'selenium_standalone:serverConfig:stop']);
};
