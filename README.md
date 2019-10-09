# grunt-html-dom-snapshot
[![NPM version](https://badge.fury.io/js/grunt-html-dom-snapshot.png)](http://badge.fury.io/js/grunt-html-dom-snapshot)
[![Build Status](https://travis-ci.org/prantlf/grunt-html-dom-snapshot.png)](https://travis-ci.org/prantlf/grunt-html-dom-snapshot)
[![Coverage Status](https://coveralls.io/repos/github/prantlf/grunt-html-dom-snapshot/badge.svg?branch=master)](https://coveralls.io/github/prantlf/grunt-html-dom-snapshot?branch=master)
[![Dependency Status](https://david-dm.org/prantlf/grunt-html-dom-snapshot.svg)](https://david-dm.org/prantlf/grunt-html-dom-snapshot)
[![devDependency Status](https://david-dm.org/prantlf/grunt-html-dom-snapshot/dev-status.svg)](https://david-dm.org/prantlf/grunt-html-dom-snapshot#info=devDependencies)
[![devDependency Status](https://david-dm.org/prantlf/grunt-html-dom-snapshot/peer-status.svg)](https://david-dm.org/prantlf/grunt-html-dom-snapshot#info=peerDependencies)

[![NPM Downloads](https://nodei.co/npm/grunt-html-dom-snapshot.png?downloads=true&stars=true)](https://www.npmjs.com/package/grunt-html-dom-snapshot)

This module provides a grunt multi-task for taking "snapshots" of the HTML markup on web pages - of their immediate DOM content - and saving them to HTML files. It can be used to obtain content of web pages, which are built dynamically by JavaScript, and check it for validity and accessibility. It uses [webdriverio] and [Selenium] to control the selected web browser.

![Sample page](https://raw.githubusercontent.com/prantlf/grunt-html-dom-snapshot/master/assets/sample-page.png) ![Right arrow](https://raw.githubusercontent.com/prantlf/grunt-html-dom-snapshot/master/assets/arrow-right.png) ![Sample snapshot](https://raw.githubusercontent.com/prantlf/grunt-html-dom-snapshot/master/assets/sample-snapshot.png)

In addition, recent versions can save "screenshots" of browser viewport at the same time to support visual testing by comparing the look of the page with the baseline picture. Actually, this task is quickly evolving to offer end-to-end test capabilities too.

See the [migration documentation] about compatibility of older versions with the latest v4.

Additional Grunt tasks, which are usually used to support test automation:

* [grunt-accessibility] - checks accessibility of HTML markup according to the [WCAG] standard
* [grunt-accessibility-html-report-converter] - converts JSON report of `grunt-accessibility` to HTML
* [grunt-contrib-connect] - starts a static web server to server testing pages for the web browser
* [grunt-html] - validates HTML markup according to the [W3C HTML] standard
* [grunt-html-html-report-converter] - converts JSON report of `grunt-html` to HTML
* [grunt-reg-viz] - compares images and generates report with differences
* [grunt-selenium-standalone] - runs a standalone Selenium server

# Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
  - [Options](#options)
  - [Sub-tasks](#sub-tasks)
  - [Instructions](#instructions)
  - [Instruction Combinations](#instruction-combinations)
  - [Loading](#loading)
- [Build](#build)
- [Example](#example)
- [Contributing](#contributing)
- [Release History](#release-history)
- [License](#license)

## Installation

You need [node >= 4][node], [npm] and [grunt >= 0.4.5][Grunt] installed
and your project build managed by a [Gruntfile] with the necessary modules
listed in [package.json].  If you have not used Grunt before, be sure to
check out the [Getting Started] guide, as it explains how to create a
Gruntfile as well as install and use Grunt plugins.  Once youin are familiar
with that process, you may install this plugin with this command:

```shell
$ npm install grunt-html-dom-snapshot --save-dev
```

## Configuration

Add the `html-dom-snapshot` entry with the task configuration to the options of the `grunt.initConfig` method:

```js
grunt.initConfig({
  'html-dom-snapshot': {
    'google': {
      url: 'https://www.google.com'
    }
  }
});
```

Default options support the most usual usage scenario:

```js
'html-dom-snapshot': {
  options: {
    webdriver: {
      logLevel: 'warn',
      capabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': {
          args: ['--headless']
        }
      }
    },
    viewport: {
      width: 1024,
      height: 768
    },
    selectorTimeout: 10000,
    instructionDelay: 0,
    doctype: '<!DOCTYPE html>',
    snapshots: 'snapshots',
    screenshots: null,
    fileNumbering: false,
    fileNumberDigits: 3,
    fileNumberSeparator: '.',
    hangOnError: false,
    snapshotOnError: '_last-error',
    singleElementSelections: false,
    force: false
  },
  'google': {
    url: 'https://www.google.com'
  }
}
```

Make sure, that you have the stable version of Chrome installed, if you leave the defaults intact.

### Options

#### webdriver
Type: `Object`
Default value: see above

Chooses the web browser to take snapshots with, Selenium host and other parameters supported by WebdriverIO as input for the  `webdriverio.remote` method. This object has to contain the property `capabilities` with `browserName` and optionally other properties depending on the web browser driver. The following browser names are the most usually used: `chrome`, `edge`, `firefox`, `ie`, `phantomjs`, `safari`. Depending on what browser you specify, you will need to load the corresponding Selenium driver. These are current versions of the drivers:

```js
'selenium_standalone': {
  serverConfig: {
    seleniumVersion: '3.141.5', // 3.7.1 or older is needed for phantomjs
    seleniumDownloadURL: 'http://selenium-release.storage.googleapis.com',
    drivers: {
      chrome: {
        version: '77.0.3865.40',
        arch: process.arch,
        baseURL: 'https://chromedriver.storage.googleapis.com'
      },
      // https://developer.microsoft.com/en-us/microsoft-edge/tools/webdriver/
      edge: {
        version: '6.17134'
      },
      // https://github.com/mozilla/geckodriver/releases
      firefox: {
        version: '0.24.0'
      },
      // https://selenium-release.storage.googleapis.com/
      ie: {
        version: '3.14.0',
        arch: 'ia32'
      },
      // https://selenium-release.storage.googleapis.com/
      safari: {
        version: '2.53'
      },
      // https://bitbucket.org/ariya/phantomjs/downloads/
      phantomjs: {
        version: '2.1.1'
      }
    }
  }
}
```

Th other often used property is `logLevel`, set to "warn" by default. Valid values are "trace", "debug", "info", "warn", "error" and "silent".

#### viewport
Type: `Object`
Default value: {width: 1024, height: 768}

Resizes the web browser viewport to the specified `width` and `height` values (in pixels) before taking snapshots.

#### selectorTimeout
Type: `Number`
Default value: 10000

Maximum waiting time (in milliseconds), until a DOM node with the selector specified by the `wait` property appears or disappears. Taking the snapshot fails, if this time is exceeded.

#### instructionDelay
Type: `Number`
Default value: 0

Waiting time after executing an instruction. If the test is not run in the headless browser, but debugged in the browser window, it is sometimes helpful to watch outcome of every operation. If introducing waiting instructions all over is too cumbersome, this configuration will add the delay (in milliseconds) after every instruction automatically.

#### doctype
Type: `String`
Default value: '<!DOCTYPE html>'

Sets the HTML doctype to be written to the file with the snapshot. [WebdriverIO API] does not support getting its value. HTML validators require the doctype and to make the integration with other tasks easier it can be written to the snapshot file using this option.

#### snapshots
Type: `String`
Default value: 'snapshots'

Destination directory to write the page snapshots to. It will be created if it does not exist. If set to `null`, snapshots will not be saved. It can be used to have only screenshots saved.

#### screenshots
Type: `String`
Default value: null

Destination directory to write the viewport screenshots to. It will be created if it does not exist. Default value is `null`, which means, that no screenshots will be written out.

#### fileNumbering
Type: `Booolean`|`String`
Default value: `false`

If set to `true`, enables prefixing names of snapshot and screenshot files with their index number, for example: "002.google-input.html". Every occurrence of the `file` instruction increases the file count.

If set to "per-directory", the index number will be increased separately per sub-directory with snapshots. If the value of the `file` instruction contains a slash, it will put the snapshot to a sub-directory, which may be useful to organize many snapshots created by multiple tasks.

#### fileNumberDigits
Type: `Number`
Default value: `3`

Ensures, that file numbers will have always at least the specified count of digits. If the number is smaller, than its power of 10, the number will be padded by zeros (0) from the left.

#### fileNumberSeparator
Type: `String`
Default value: '.'

The character to put between the file number and the file name.

### hangOnError
Type: `Boolean`
Default value: false

If set to `true`, it will not abort the process in case of a failure. It is useful, if you want to investigate the situation on the screen right after an error occurred. If you encounter an error flip this flag and re-run the failing scenario. Once you are finished terminate the process or interrupt it by Ctrl+C.

### snapshotOnError
Type: `String`
Default value: '_last-error'

If set to a non-empty string, if will be used as a file name for an automatically taken snapshot and screenshot (if those are enabled), if the task execution fails.

### singleElementSelections
Type: `Boolean`
Default value: false

If set to `true`, it will enforce every selector match either one or none elements. If any selector matches multiple elements, the instruction will fail. Tests usually address just one element. This setting helps to uncover errors like checking `isFocus` for multiple elements, which has unpredictable results.

This option can be set for the whole task or within a single command object.

#### force
Type: `Boolean`
Default value: false

If set to `true`, it suppresses failures, which happened during taking snapshots. Instead of making the Grunt fail, the errors will be written only to the console.

### Sub-tasks

File names for snapshots can be used as sub-task names. Separate sub-tasks initialize separate instance of the webdriver:

```js
'html-dom-snapshot': {
  'google': {
    url: 'https://google.com'
  },
  'github': {
    url: 'https://github.com'
  }
}
```

If the sub-task contains a property `commands`, this property is supposed to point to an array of command objects - navigations and other browser interactions, waiting for browser states and making snapshots. They share the same instance of the webdriver, which improves the performance:

```js
'html-dom-snapshot': {
  all: {
    commands: [
      {
        url: 'https://google.com',
        file: 'google'
      },
      {
        url: 'https://github.com',
        file: 'github'
      }
    ]
  }
}
```

If the sub-task contains a property `scenarios`, this property is supposed to point to a JavaScript module path or to an array of JavaScript module paths, which would export the array of commands. Relative paths will be resolved to the current (process) directory. It allows to keep the Gruntfile legible and supply the test instructions from other files:

```js
'html-dom-snapshot': {
  all: {
    scenarios: 'scenarios/*.js'
  }
}
```

You can use sub-tasks, `commands` and `scenarios` to structure your code and execute the tests separately, or all of them in one browser window.

### Instructions

One of the [instructions] has to be present in every command, otherwise its execution will fail. If you include a key in your command object, which is not recognised as an instruction or other known key (`file`, `options`), the execution will fail too. The following instructions are recognised (and their effect is executed) in the order, in which they are listed below:

* [if-then-else](INSTRUCTIONS.md#if-then-else)
* [while-do](INSTRUCTIONS.md#while-do)
* [do-until](INSTRUCTIONS.md#do-until)
* [repeat-do](INSTRUCTIONS.md#repeat-do)
* [setViewport](INSTRUCTIONS.md#setviewport)
* [url](INSTRUCTIONS.md#url)
* [go](INSTRUCTIONS.md#go)
* [scroll](INSTRUCTIONS.md#scroll)
* [focus](INSTRUCTIONS.md#focus)
* [clearValue](INSTRUCTIONS.md#clearvalue)
* [setValue](INSTRUCTIONS.md#setvalue)
* [addValue](INSTRUCTIONS.md#addvalue)
* [selectOptionByIndex](INSTRUCTIONS.md#selectoptionbyindex)
* [selectOptionByValue](INSTRUCTIONS.md#selectoptionbyvalue)
* [moveCursor](INSTRUCTIONS.md#movecursor)
* [click](INSTRUCTIONS.md#click)
* [clickIfVisible](INSTRUCTIONS.md#clickIfVisible)
* [keys](INSTRUCTIONS.md#keys)
* [elementSendKeys](INSTRUCTIONS.md#elementSendKeys)
* [wait](INSTRUCTIONS.md#wait)
* [isExisting](INSTRUCTIONS.md#isexisting)
* [isVisible](INSTRUCTIONS.md#isvisible)
* [isVisibleWithinViewport](INSTRUCTIONS.md#isvisiblewithinviewport)
* [isEnabled](INSTRUCTIONS.md#isenabled)
* [isSelected](INSTRUCTIONS.md#isselected)
* [isFocused](INSTRUCTIONS.md#isfocused)
* [isNotExisting](INSTRUCTIONS.md#isnotexisting)
* [isNotVisible](INSTRUCTIONS.md#isnotvisible)
* [isNotVisibleWithinViewport](INSTRUCTIONS.md#isnotvisiblewithinviewport)
* [isNotEnabled](INSTRUCTIONS.md#isnotenabled)
* [isNotSelected](INSTRUCTIONS.md#isnotselected)
* [isNotFocused](INSTRUCTIONS.md#isnotfocused)
* [hasAttribute](INSTRUCTIONS.md#hasattribute)
* [hasClass](INSTRUCTIONS.md#hasclass)
* [hasValue](INSTRUCTIONS.md#hasvalue)
* [hasText](INSTRUCTIONS.md#hastext)
* [hasInnerHtml](INSTRUCTIONS.md#hasinnerhtml)
* [hasOuterHtml](INSTRUCTIONS.md#hasouterhtml)
* [break](INSTRUCTIONS.md#break)
* [abort](INSTRUCTIONS.md#abort)
* [file](INSTRUCTIONS.md#file)

#### options
Type: `Object` (optional)

Options specific for the one particular command. They will be merged with the task options to specialize taking of the particular snapshot:

```js
{
  options: {
    viewport: {
      width: 1600,
      height: 900
    }
  },
  url: 'https://google.com',
  file: 'google'
}
```

### Instruction Combinations

The following array of commands within the `commands` property will change location, make a snapshot immediately to save the server-side pre-rendered content, then another one to see the progress after the first 500 milliseconds and yet another one, once the search form is ready. Then it submits the form by clicking on the "Search" button, waits until the search results are displayed and makes one final snapshot.

```js
{
  url: 'https://localhost/app'
  file: 'initial.html'
},
{
  wait: 500,
  file: 'after-500ms'
},
{
  wait: '#search',
  file: 'form-ready'
},
{
  wait: function (browser) {
    return browser.$('#search')
      .then(element => {
        element.click();
        return element;
      })
      .then(element => element.waitForExist(1000));
  },
  file: 'results-shown'
}
```

The last command can be written in a declarative way too:

```js
{
  options: {
    selectorTimeout: 1000
  },
  click: '#search',
  wait: '#results',
  file: 'results-shown'
}
```

Other Grunt tasks can run later and validate, compare or otherwise process the page content in different stages of the "Search" scenario.

Navigating to other location, interacting with the page, waiting for some effect to show and saving a snapshot can be divided to different objects in the `commands` array. However, at least One of the `file`, `url` ans `wait` parameters has to be present in ever object.

When the commands become too many, you can divide them per page or per other criterion, which corresponds with a scenario and load them from separate modules:

```js
'html-dom-snapshot': {
  addressbook: require('./test/scenarios/addressbook'),
  calendar: require('./test/scenarios/calendar'),
  inbox: require('./test/scenarios/inbox'),
  tasks: require('./test/scenarios/tasks')
}
```

The module for the address book implementation would look like this:

```js
module.exports = {
  options: {...}, // optional task-specific options
  commands: [
    {
      url: 'https://localhost/addressbook'
      wait: '#addressbook.complete'
    },
    ...
  ]
}
```

The same tests will be run in a single browser window, if the Gruntfile contains just a single sub-task and the tests are specified by scenario files:

```js
'html-dom-snapshot': {
  all: {
    scenarios: 'test/scenarios/*.js'
  }
}
```

The directory "test/scenarios" would contain files  "addressbook.js", "calendar.js", "inbox.js" and "tasks.js", which would specify only the array of commands; not the entire sub-task objects. For example, the address book implementation:

```js
module.exports = {
  {
    options: {...}, // optional command-specific options
    url: 'https://localhost/addressbook'
    wait: '#addressbook.complete'
  },
  ...
]
```

### Loading

Load the plugin in `Gruntfile.js`:

```javascript
grunt.loadNpmTasks('grunt-html-dom-snapshot');
```

## Build

Call the `html-dom-snapshot` task:

```shell
$ grunt html-dom-snapshot
```

or integrate it to your build sequence in `Gruntfile.js`:

```js
grunt.registerTask('default', ['html-dom-snapshot', ...]);
```

## Example

When [webdriverio] is called, it needs to connect to a [Selenium] server. The easiest way, how to get it running is using the [selenium-standalone] Grunt task, which downloads, starts and stop the server. If the usage scenario is to validate static files or a mocked web application, a local web server like [grunt-contrib-connect] is usually added. And additional checking tasks like [grunt-html] pr [grunt-accessibility]. The complete Grunt initialization could look like this:

```js
grunt.initConfig({
  connect: { // Serves static files in the current directory.
    server: {
      options: {port: 8881}
    }
  },

  clean: { // Cleans the previously taken snapshots.
    snapshots: ['snapshots/*']
  },

  'html-dom-snapshot': { // Takes new snapshots.
    all: {
      ...
    }
  },

  htmllint: { // Checks if the HTML markup is valid.
    all: {
      src: ['snapshots/*.html']
    }
  },

  accessibility: { // Checks if the page complies to the WCAG AA standard.
    all: {
      src: ['snapshots/*.html']
    }
  },

  'selenium_standalone': { // Provides a local Selenium server.
    serverConfig: {
      seleniumVersion: '3.141.5',
      seleniumDownloadURL: 'https://selenium-release.storage.googleapis.com',
      drivers: {
        chrome: {
          version: '77.0.3865.40',
          arch: process.arch,
          baseURL: 'https://chromedriver.storage.googleapis.com'
        }
      }
    }
  }
});

grunt.loadNpmTasks('grunt-accessibility');
grunt.loadNpmTasks('grunt-contrib-clean');
grunt.loadNpmTasks('grunt-contrib-connect');
grunt.loadNpmTasks('grunt-html');
grunt.loadNpmTasks('grunt-html-dom-snapshot');
grunt.loadNpmTasks('grunt-selenium-standalone');

grunt.registerTask('default', [
  'selenium_standalone:serverConfig:install',
  'selenium_standalone:serverConfig:start',
  'connect', 'clean', 'html-dom-snapshot',
  'selenium_standalone:serverConfig:stop',
  'htmllint', 'accessibility']);
```

The installation of the necessary Grunt tasks:

```bash
npm install grunt-html-dom-snapshot grunt-selenium-standalone \
            grunt-contrib-clean grunt-contrib-connect \
            grunt-accessibility grunt-html --save-dev
```

### Notes

You will need to **install [Java] 8 or newer** to get the Selenium server running via the [selenium-standalone] Grunt task.

**If you want to use the PhantomJS driver, you will need to install the `phantomjs-prebuilt` module**. For example:

```shell
$ npm install phantomjs-prebuilt --save-dev
```

The `phantomjs` binary will be accessible in `./node_modules/.bin`. If you do not start the Selenium server using `npm test` or other `npm run` command, you will havew to add this directory to your `PATH`, otherwise the PhantomJS driver will not find the executable. Additionally, **PhantomJS 2.1.1 works only with the Selenium driver version 3.7.1 or older**. For example:

```js
'selenium_standalone': {
  serverConfig: {
    seleniumVersion: '3.7.1',
    seleniumDownloadURL: 'http://selenium-release.storage.googleapis.com',
    drivers: {
      phantomjs: {
        version: '2.1.1'
      }
    }
  }
},
'html-dom-snapshot': {
  options: {
    webdriver: {
      capabilities: {
        browserName: 'phantomjs'
      }
    }
  }
}
```

If you want to test with a headless browser, you may want to **prefer Chrome to PhantomJS**. Chrome can run in the headless mode too and PhantomJS is not developed any more. If you do - and it is the default, **make sure that a stable version of Chrome has been installed** on your machine.

The default configuration of this task will choose Chrome in the headless mode starting from the version 2.0.0 and newer:

```js
'html-dom-snapshot': {
  options: {
    webdriver: {
      capabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': {
          args: ['--headless']
        }
      }
    }
  }
}
```

If you want to run Chrome in the windowed mode, override the `chromeOptions` object with yours, even an empty one, which is missing the `--headless` argument, for example:

```js
'html-dom-snapshot': {
  options: {
    webdriver: {
      capabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': {}
      }
    }
  }
}
```

If you want to run Chrome in Travis CI, override the `goog:chromeOptions` object with yours and disable the sandbox with `--no-sandbox`. **Chrome sandbox appears not working in Docker containers used by Travis**, but Chrome enbales it by default there. For example:

```js
'html-dom-snapshot': {
  options: {
    webdriver: {
      capabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': {
          args: ['--headless', '--no-sandbox']
        }
      }
    }
  }
}
```

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding
style.  Add unit tests for any new or changed functionality. Lint and test
your code using Grunt.

## Release History

 * 2019-09-21  [v4.0.0]  Upgrade to WebDriverIO 5, add the instruction "elementSendKeys"
 * 2019-07-21  [v3.0.0]  Report unrecognised instructions as errors, introduce new instructions (focus, while-do, do-until, repeat-do, break)
 * 2019-07-08  [v2.2.0]  Optionally hang the browser in case of failure to be able to inspect the web page in developer tools
 * 2018-11-26  [v2.0.0]  Use headless Chrome instead of PhantomJS by default, introduce conditional if-then-else instructions
 * 2018-05-14  [v1.3.0]  Allow saving snapshots to sub-directories, file numbering per-directory, add `scroll` instruction
 * 2018-05-11  [v1.2.0]  Introduce delay after every instruction to be able to visually follow the actions when debugging
 * 2018-03-29  [v1.1.0]  Allow specifying all initialization parameters supported by WebdriverIO
 * 2018-03-28  [v1.0.2]  Stop Selenium and Chromedriver processes on unexpected Grunt process abortion
 * 2018-03-28  [v1.0.1]  Workaround for hanging chromedriver after finishing the task
 * 2018-03-11  [v1.0.0]  Require Node.js >= 6
 * 2018-03-11  [v0.8.0]  Add a new instruction - "abort"
 * 2018-03-01  [v0.7.0]  Add optional automatic file numbering
 * 2018-02-28  [v0.6.0]  Add the allRequired option to the hasClass instruction
 * 2018-02-26  [v0.5.0]  Allow checking and setting various properties
 * 2018-02-22  [v0.4.0]  Allow sending key strokes to the browser
 * 2018-01-30  [v0.3.0]  Allow specifying test commands in separate modules
 * 2018-01-27  [v0.2.0]  Allow saving screenshots in addition to snapshots
 * 2017-11-18  [v0.1.0]  Allow separate navigation, page interaction and saving snapshots
 * 2017-11-12  [v0.0.1]  Initial release

## License

Copyright (c) 2017-2019 Ferdinand Prantl

Licensed under the MIT license.

[migration documentation]: ./MIGRATION.md
[node]: https://nodejs.org
[npm]: https://npmjs.org
[package.json]: https://docs.npmjs.com/files/package.json
[Grunt]: https://gruntjs.com
[Gruntfile]: https://gruntjs.com/sample-gruntfile
[Getting Gtarted]: https://github.com/gruntjs/grunt/wiki/Getting-started
[Selenium]: http://www.seleniumhq.org/download/
[webdriverio]: http://webdriver.io/
[WebdriverIO API]: http://webdriver.io/api.html
[selenium-standalone]: https://github.com/zs-zs/grunt-selenium-standalone
[Java]: https://java.com/en/download/
[W3C HTML]: https://www.w3.org/standards/techs/html
[WCAG]: https://www.w3.org/WAI/intro/wcag
[grunt-accessibility]: https://github.com/yargalot/grunt-accessibility
[grunt-accessibility-html-report-converter]: https://github.com/prantlf/grunt-accessibility-html-report-converter
[grunt-contrib-connect]: https://github.com/gruntjs/grunt-contrib-connect
[grunt-html]: https://github.com/jzaefferer/grunt-html
[grunt-html-html-report-converter]: https://github.com/prantlf/grunt-html-html-report-converter
[grunt-reg-viz]: https://github.com/prantlf/grunt-reg-viz
[grunt-selenium-standalone]: https://github.com/zs-zs/grunt-selenium-standalone
[keyboard key identifiers]: https://w3c.github.io/webdriver/webdriver-spec.html#keyboard-actions
[v3.0.0]: https://github.com/prantlf/grunt-html-dom-snapshot/releases/tag/v3.0.0
[v2.2.0]: https://github.com/prantlf/grunt-html-dom-snapshot/releases/tag/v2.2.0
[v2.0.0]: https://github.com/prantlf/grunt-html-dom-snapshot/releases/tag/v2.0.0
[v1.3.0]: https://github.com/prantlf/grunt-html-dom-snapshot/releases/tag/v1.3.0
[v1.2.0]: https://github.com/prantlf/grunt-html-dom-snapshot/releases/tag/v1.2.0
[v1.1.0]: https://github.com/prantlf/grunt-html-dom-snapshot/releases/tag/v1.1.0
[v1.0.2]: https://github.com/prantlf/grunt-html-dom-snapshot/releases/tag/v1.0.2
[v1.0.1]: https://github.com/prantlf/grunt-html-dom-snapshot/releases/tag/v1.0.1
[v1.0.0]: https://github.com/prantlf/grunt-html-dom-snapshot/releases/tag/v1.0.0
[v0.8.0]: https://github.com/prantlf/grunt-html-dom-snapshot/releases/tag/v0.8.0
[v0.7.0]: https://github.com/prantlf/grunt-html-dom-snapshot/releases/tag/v0.7.0
[v0.6.0]: https://github.com/prantlf/grunt-html-dom-snapshot/releases/tag/v0.6.0
[v0.5.0]: https://github.com/prantlf/grunt-html-dom-snapshot/releases/tag/v0.5.0
[v0.4.0]: https://github.com/prantlf/grunt-html-dom-snapshot/releases/tag/v0.4.0
[v0.3.0]: https://github.com/prantlf/grunt-html-dom-snapshot/releases/tag/v0.3.0
[v0.2.0]: https://github.com/prantlf/grunt-html-dom-snapshot/releases/tag/v0.2.0
[v0.1.0]: https://github.com/prantlf/grunt-html-dom-snapshot/releases/tag/v0.1.0
[v0.0.1]: https://github.com/prantlf/grunt-html-dom-snapshot/releases/tag/v0.0.1
[instructions]: INSTRUCTIONS.md
