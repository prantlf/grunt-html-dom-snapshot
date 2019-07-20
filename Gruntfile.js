'use strict'

module.exports = function (grunt) {
  const coverage = process.env.GRUNT_HTML_DOM_SNAPSHOT_COVERAGE

  grunt.initConfig({
    standard: {
      all: {
        src: [
          'Gruntfile.js',
          'tasks/**/*.js',
          '<%= nodeunit.tests %>'
        ]
      }
    },

    instrument: {
      files: 'tasks/**/*.js',
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
        webdriver: {
          desiredCapabilities: {
            browserName: 'chrome',
            chromeOptions: {
              args: ['--headless', '--no-sandbox']
            }
          }
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
              screenshots: 'test/screenshots',
              fileNumbering: true
            },
            url: 'http://localhost:8881/test/pages/static.html',
            file: 'static.html'
          },
          {
            url: 'http://localhost:8881/test/pages/delayed.html',
            wait: 200,
            file: 'delayed'
          },
          {
            options: {
              screenshots: 'test/screenshots'
            },
            url: 'http://localhost:8881/test/pages/dynamic.html',
            wait: '.dynamic',
            file: 'dynamic'
          },
          {
            options: {
              viewport: {
                width: 1600,
                height: 900
              }
            },
            url: 'http://localhost:8881/test/pages/dynamic-reverse.html',
            wait: '!.dynamic',
            file: 'dynamic-reverse'
          },
          {
            url: 'http://localhost:8881/test/pages/dynamic-delayed.html',
            wait: [
              '.dynamic',
              200
            ],
            file: 'dynamic-delayed'
          },
          {
            url: 'http://localhost:8881/test/pages/dynamic-custom.html',
            wait: function (browser) {
              return browser.waitForExist('.dynamic', 1000)
            },
            file: 'dynamic-custom'
          },
          {
            options: {
              doctype: '',
              fileNumbering: 'per-directory'
            },
            url: 'http://localhost:8881/test/pages/no-doctype.html',
            file: 'directory/no-doctype'
          },
          {
            options: {
              instructionDelay: 1
            },
            wait: 1
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
          },
          {
            go: 'back',
            wait: function (browser) {
              return browser.getUrl()
                .then(function (url) {
                  if (url !== 'http://localhost:8881/test/pages/no-doctype.html') {
                    throw new Error('go:back failed')
                  }
                })
            }
          },
          {
            go: 'forward',
            wait: function (browser) {
              return browser.getUrl()
                .then(function (url) {
                  if (url !== 'http://localhost:8881/test/pages/dynamic-multiple.html') {
                    throw new Error('go:forward failed')
                  }
                })
            }
          },
          {
            go: 'refresh',
            wait: function (browser) {
              return browser.getUrl()
                .then(function (url) {
                  if (url !== 'http://localhost:8881/test/pages/dynamic-multiple.html') {
                    throw new Error('go:forward failed')
                  }
                })
            }
          },
          {
            url: 'http://localhost:8881/test/pages/input.html',
            scroll: 'input',
            moveCursor: 'input',
            click: 'input',
            wait: function (browser) {
              return browser.hasFocus('input')
                .then(function (value) {
                  if (value !== true) {
                    throw new Error('click failed')
                  }
                })
            }
          },
          {
            scroll: {
              offset: {
                top: 0,
                left: 0
              }
            },
            clickIfVisible: 'input',
            wait: function (browser) {
              return browser.hasFocus('input')
                .then(function (value) {
                  if (value === false) {
                    throw new Error('clickIfVisible on body failed')
                  }
                })
            }
          },
          {
            setValue: {
              selector: 'input',
              value: 'Hi'
            },
            wait: function (browser) {
              return browser.getValue('input')
                .then(function (value) {
                  if (value !== 'Hi') {
                    throw new Error('setValue failed')
                  }
                })
            }
          },
          {
            addValue: {
              selector: 'input',
              value: ' there!'
            },
            wait: function (browser) {
              return browser.getValue('input')
                .then(function (value) {
                  if (value !== 'Hi there!') {
                    throw new Error('addValue failed')
                  }
                })
            }
          },
          {
            clearValue: 'input',
            wait: function (browser) {
              return browser.getValue('input')
                .then(function (value) {
                  if (value !== '') {
                    throw new Error('clearValue failed')
                  }
                })
            }
          },
          {
            click: 'input',
            keys: 'test',
            wait: function (browser) {
              return browser.getValue('input')
                .then(function (value) {
                  if (value !== 'test') {
                    throw new Error('sending text failed')
                  }
                })
            }
          },
          {
            keys: ['Home', 'Delete'],
            wait: function (browser) {
              return browser.getValue('input')
                .then(function (value) {
                  if (value !== 'est') {
                    throw new Error('sending key strokes failed', value)
                  }
                })
            }
          },
          {
            url: 'http://localhost:8881/test/pages/values.html',
            isEnabled: 'select',
            isExisting: 'select',
            isFocused: 'select',
            isVisible: 'select',
            isVisibleWithinViewport: 'select',
            isSelected: 'select > option:last-child',
            isNotEnabled: 'input',
            isNotExisting: 'textarea',
            isNotFocused: 'input',
            isNotVisible: 'input',
            isNotVisibleWithinViewport: 'input',
            isNotSelected: 'select > option:first-child',
            hasAttribute: {
              selector: 'input',
              name: 'disabled',
              value: 'true'
            },
            hasValue: {
              selector: 'input',
              value: 'test'
            },
            hasText: {
              selector: 'div',
              value: 'Text'
            },
            hasInnerHtml: {
              selector: 'div',
              value: 'Text'
            },
            hasOuterHtml: {
              selector: 'div',
              value: '<div class="class" tabindex="0">Text</div>'
            }
          },
          coverage ? { wait: 1 } : {
            focus: 'body',
            wait: function (browser) {
              return browser.hasFocus('body')
                .then(function (value) {
                  if (value !== false) {
                    throw new Error('focus on body failed')
                  }
                })
            }
          },
          {
            clickIfVisible: 'input',
            wait: function (browser) {
              return browser.hasFocus('input')
                .then(function (value) {
                  if (value !== false) {
                    throw new Error('clickIfVisible on invisible input failed')
                  }
                })
            }
          },
          {
            hasClass: {
              selector: 'div',
              value: 'class'
            }
          },
          {
            hasClass: {
              selector: 'div',
              value: '!none'
            }
          },
          {
            hasClass: {
              selector: 'div',
              value: 'class none'
            }
          },
          {
            hasClass: {
              selector: 'div',
              value: 'class !none',
              allRequired: true
            }
          },
          {
            selectOptionByIndex: {
              selector: 'select',
              index: 1
            },
            hasValue: {
              selector: 'select',
              value: '2'
            }
          },
          {
            selectOptionByValue: {
              selector: 'select',
              value: '1'
            },
            hasValue: {
              selector: 'select',
              value: '1'
            }
          },
          {
            if: {
              hasClass: {
                selector: 'div',
                value: 'class none'
              }
            },
            else: {
              wait: function () {
                throw new Error('executed else branch')
              }
            }
          },
          {
            if: [{
              hasClass: {
                selector: 'div',
                value: 'dummy'
              }
            }],
            then: [{
              wait: function () {
                throw new Error('executed then branch')
              }
            }],
            else: [{
              wait: 1
            }]
          },
          {
            setViewport: {
              width: 768,
              height: 480
            }
          },
          {
            setViewport: {}
          },
          {
            setViewport: {}
          }
        ],
        scenarios: 'test/scenarios/*.js'
      },
      'no-input': {
        options: {
          force: true
        },
        commands: [
          {}
        ]
      },
      'invalid-instruction': {
        options: {
          force: true
        },
        commands: [
          {invalid: {}}
        ]
      },
      'invalid-file': {
        options: {
          browserCapabilities: {
            browserName: 'chrome',
            chromeOptions: {
              args: ['--headless', '--no-sandbox']
            }
          },
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
      },
      'invalid-go': {
        options: {
          force: true,
          screenshots: 'test/screenshots'
        },
        pages: [
          {
            url: 'http://localhost:8881',
            go: 'dummy'
          }
        ]
      },
      'invalid-wait': {
        options: {
          force: true
        },
        commands: [
          {wait: true}
        ]
      },
      'abort': {
        options: {
          force: true
        },
        commands: [
          {abort: 'Stop.'},
          {file: 'aborted'}
        ]
      }
    },

    'selenium_standalone': {
      options: {
        stopOnExit: true
      },
      server: {
        seleniumVersion: '3.141.5',
        seleniumDownloadURL: 'http://selenium-release.storage.googleapis.com',
        drivers: {
          chrome: {
            version: '74.0.3729.6',
            arch: process.arch,
            baseURL: 'https://chromedriver.storage.googleapis.com'
          }
          // https://developer.microsoft.com/en-us/microsoft-edge/tools/webdriver/
          // edge: {
          //   version: '6.17134'
          // },
          // https://github.com/mozilla/geckodriver/releases
          // firefox: {
          //   version: '0.24.0'
          // },
          // https://selenium-release.storage.googleapis.com/
          // ie: {
          //   version: '3.14.0',
          //   arch: 'ia32'
          // },
          // https://selenium-release.storage.googleapis.com/
          // safari: {
          //   version: '2.53'
          // }
        }
      }
    }
  })

  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-contrib-connect')
  grunt.loadNpmTasks('grunt-contrib-nodeunit')
  grunt.loadNpmTasks('grunt-coveralls')
  grunt.loadNpmTasks('grunt-istanbul')
  grunt.loadNpmTasks('grunt-selenium-standalone')
  grunt.loadNpmTasks('grunt-standard')
  grunt.loadTasks(coverage ? 'coverage/tasks' : 'tasks')

  const test = ['clean', 'standard',
    'selenium_standalone:server:start',
    'connect', 'html-dom-snapshot',
    'selenium_standalone:server:stop', 'nodeunit']
  const report = coverage ? ['storeCoverage', 'makeReport'] : []
  grunt.registerTask('default', test.concat(report))
}
