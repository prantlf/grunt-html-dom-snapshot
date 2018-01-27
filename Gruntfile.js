'use strict';

module.exports = function (grunt) {
  const coverage = process.env.GRUNT_HTML_DOM_SNAPSHOT_COVERAGE;

  grunt.initConfig({
    eslint: {
      target: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ]
    },

    instrument: {
      files: 'tasks/*.js',
      options: {
        lazy: true,
        basePath: 'coverage/'
      }
    },

    storeCoverage: {
      options: {
        dir: 'coverage'
      }
    },

    makeReport: {
      src: 'coverage/coverage.json',
      options: {
        type: 'lcov',
        dir: 'coverage',
        print: 'detail'
      }
    },

    coveralls: {
      tests: {
        src: 'coverage/lcov.info'
      }
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
      coverage: ['coverage/**'],
      snapshots: ['test/snapshots/*'],
      screenshots: ['test/screenshots/*']
    },

    'html-dom-snapshot': {
      options: {
        browserCapabilities: {
          browserName: 'phantomjs'
        },
        snapshots: 'test/snapshots'
      },
      'single-target.html': {
        url: 'http://localhost:8881/test/pages/single-target.html'
      },
      others: {
        commands: [
          {
            options: {
              snapshots: null,
              screenshots: 'test/screenshots'
            },
            file: 'static.html',
            url: 'http://localhost:8881/test/pages/static.html'
          },
          {
            file: 'delayed',
            url: 'http://localhost:8881/test/pages/delayed.html',
            wait: 200
          },
          {
            options: {
              screenshots: 'test/screenshots'
            },
            file: 'dynamic',
            url: 'http://localhost:8881/test/pages/dynamic.html',
            wait: '.dynamic'
          },
          {
            options: {
              viewport: {
                width: 1600,
                height: 900
              }
            },
            file: 'dynamic-reverse',
            url: 'http://localhost:8881/test/pages/dynamic-reverse.html',
            wait: '!.dynamic'
          },
          {
            file: 'dynamic-delayed',
            url: 'http://localhost:8881/test/pages/dynamic-delayed.html',
            wait: [
              '.dynamic',
              200
            ]
          },
          {
            file: 'dynamic-custom',
            url: 'http://localhost:8881/test/pages/dynamic-custom.html',
            wait: function (browser) {
              return browser.waitForExist('.dynamic', 1000);
            }
          },
          {
            options: {
              doctype: ''
            },
            file: 'no-doctype',
            url: 'http://localhost:8881/test/pages/no-doctype.html'
          },
          {
            url: 'http://localhost:8881/test/pages/dynamic-multiple.html'
          },
          {
            file: 'dynamic-first'
          },
          {
            wait: '.second',
            file: 'dynamic-second'
          },
          {
            wait: '.third'
          },
          {
            file: 'dynamic-third'
          }
        ]
      },
      'no-input': {
        options: {
          force: true
        },
        commands: [
          {}
        ]
      },
      'invalid-file': {
        options: {
          screenshots: 'test/screenshots',
          force: true
        },
        pages: [
          {
            url: 'http://localhost:8881',
            file: '/\\//\\'
          }
        ]
      },
      'invalid-dest': {
        options: {
          dest: '/ /',
          force: true
        },
        dummy: {
          url: 'http://localhost:8881',
          file: 'dummy'
        }
      },
      'invalid-screenshots': {
        options: {
          screenshots: '/ /',
          force: true
        },
        pages: [
          {
            url: 'http://localhost:8881',
            file: 'dummy'
          }
        ]
      }
    },

    'selenium_standalone': {
      options: {
        stopOnExit: true
      },
      server: {
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
  grunt.loadNpmTasks('grunt-coveralls');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-istanbul');
  grunt.loadNpmTasks('grunt-selenium-standalone');
  grunt.loadTasks(coverage ? 'coverage/tasks' : 'tasks');

  const start = ['clean', 'eslint'],
        instrument = coverage ? ['instrument'] : [],
        test = ['selenium_standalone:server:install',
                'selenium_standalone:server:start',
                'connect', 'html-dom-snapshot',
                'selenium_standalone:server:stop', 'nodeunit'],
        report = coverage ? ['storeCoverage', 'makeReport'] : [];
  grunt.registerTask('default', start.concat(instrument)
                                     .concat(test)
                                     .concat(report));
};
