# grunt-html-dom-snapshot [![NPM version](https://badge.fury.io/js/grunt-html-dom-snapshot.png)](http://badge.fury.io/js/grunt-html-dom-snapshot) [![Build Status](https://travis-ci.org/prantlf/grunt-html-dom-snapshot.png)](https://travis-ci.org/prantlf/grunt-html-dom-snapshot) [![Coverage Status](https://coveralls.io/repos/github/prantlf/grunt-html-dom-snapshot/badge.svg?branch=master)](https://coveralls.io/github/prantlf/grunt-html-dom-snapshot?branch=master) [![Dependency Status](https://david-dm.org/prantlf/grunt-html-dom-snapshot.svg)](https://david-dm.org/prantlf/grunt-html-dom-snapshot) [![devDependency Status](https://david-dm.org/prantlf/grunt-html-dom-snapshot/dev-status.svg)](https://david-dm.org/prantlf/grunt-html-dom-snapshot#info=devDependencies) [![devDependency Status](https://david-dm.org/prantlf/grunt-html-dom-snapshot/peer-status.svg)](https://david-dm.org/prantlf/grunt-html-dom-snapshot#info=peerDependencies) [![Greenkeeper badge](https://badges.greenkeeper.io/prantlf/grunt-html-dom-snapshot.svg)](https://greenkeeper.io/)

[![NPM Downloads](https://nodei.co/npm/grunt-html-dom-snapshot.png?downloads=true&stars=true)](https://www.npmjs.com/package/grunt-html-dom-snapshot)

This module provides a grunt multi-task for taking "snapshots| of the HTML markup on web pages - of their immediate DOM content - and saving them to HTML files. It can be used to obtain content of web pages, which are built dynamically by JavaScript, and check it for validity and accessibility. It uses [webdriverio] and [Selenium] to control the selected web browser.

## Installation

You need [node >= 4][node], [npm] and [grunt >= 0.4.5][Grunt] installed
and your project build managed by a [Gruntfile] with the necessary modules
listed in [package.json].  If you haven't used Grunt before, be sure to
check out the [Getting Started] guide, as it explains how to create a
Gruntfile as well as install and use Grunt plugins.  Once you're familiar
with that process, you may install this plugin with this command:

```shell
$ npm install grunt-html-dom-snapshot --save-dev
```

## Configuration

Add the `html-dom-snapshot` entry with the task configuration to the options of the `grunt.initConfig` method:

```js
grunt.initConfig({
  'html-dom-snapshot': {
    'google.html': {
      url: 'https://www.google.com'
    }
  }
});
```

Default options support the most usual usage scenario:

```js
'html-dom-snapshot': {
  options: {
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
  },
  'google.html': {
    url: 'https://www.google.com'
  }
}
```

### Options

#### browserCapabilities
Type: `Object`
Default value: see above

Chooses the web browser to take snapshots with. Passed as `desiredCapabilities` to `webdriverio.remote`. This object has to contain the property `browserName` and optionally other properties depending on the web browser driver. The followintg browser names are the most usually used: `chrome`, `edge`, `firefox`, `ie`, `phantomjs`, `safari`. Depending on what browser you specify, you will need to load the corresponding Selenium driver. These are the current versions of the corresponding Selenium drivers:

```js
'selenium_standalone': {
  serverConfig: {
    seleniumVersion: '3.7.1',
    seleniumDownloadURL: 'http://selenium-release.storage.googleapis.com',
    drivers: {
      // http://chromedriver.storage.googleapis.com/
      chrome: {
        version: '2.33',
        arch: process.arch,
        baseURL: 'https://chromedriver.storage.googleapis.com'
      },
      // https://developer.microsoft.com/en-us/microsoft-edge/tools/webdriver/
      edge: {
        version: '5.16299'
      },
      // https://github.com/mozilla/geckodriver/releases
      firefox: {
        version: '0.19.1'
      },
      // https://selenium-release.storage.googleapis.com/
      ie: {
        version: '3.7.0',
        arch: 'ia32'
      },
      // https://bitbucket.org/ariya/phantomjs/downloads/
      phantomjs: {
        version: '2.1.1'
      },
      // https://selenium-release.storage.googleapis.com/
      safari: {
        version: '2.48'
      }
    }
  }
}
```


#### viewport
Type: `Object`
Default value: {width: 1024, height: 768}

Resizes the web browser viewport to the specified `width` and `height` values (in pixels) before taking snapshots.

#### selectorTimeout
Type: `Number`
Default value: 10000

Maximum waiting time, until a DOM node with the selector specified by the `wait` property appears or disappears. Taking the snapshot fails, if this time is exceeded.

#### doctype
Type: `String`
Default value: '<!DOCTYPE html>'

Sets the HTML doctype to be written to the file with the snapshot. [WebdriverIO API] does not support getting its value. HTML validators require the doctype and to make the integration with other tasks easier it can be written to the snapshot file using this option.

#### dest
Type: `String`
Default value: 'snapshots'

Destination directory to write the page snapshots to. It will be created if it does not exist.

#### force
Type: `Boolean`
Default value: false

If set to `true`, it suppresses failures, which happened during taking snapshots. Instead of making the Grunt fail, the errors will be written only to the console.

### Sub-tasks

File names for snapshots can be used as sub-task names. Separate sub-tasks initialize separate instance of the webdriver:

```js
'html-dom-snapshot': {
  'google.html': {
    url: 'https://google.com'
  },
  'github.html': {
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
        file: 'google.html',
        url: 'https://google.com'
      },
      {
        file: 'github.html',
        url: 'https://github.com'
      }
    ]
  }
}
```

### Parameters

One of the `file`, `url` ans `wait` properties has to be present in every command.

#### file
Type: `String`

Name of the file to write the snapshot to.

```js
{
  file: 'google.html',
  url: 'https://google.com'
}
```

If it is omitted, the object will save no snashot. It can still change location or wait for some change.

#### url
Type: `String`

URL to connect the web browser to for taking the snapshot.

```js
{
  file: 'google.html',
  url: 'https://google.com'
}
```

If it is omitted, the object will reuse the previous location. It can wait for a further change and/or save another snapshot.

#### options
Type: `Object` (optional)

Options specific for taking snapshot of a one particular page. They will be merged with the task options to specialize taking of the particular snapshot:

```js
{
  file: 'google.html',
  url: 'https://google.com',
  options: {
    viewport: {
      width: 1600,
      height: 900
    }
  }
}
```

#### wait
Type: `Number` | `String` | `Function` | `Array` (optional)

Delays taking of the snapshot until a condition s met depending on the value type:

`Number` - number of milliseconds to wait:

```js
{
  file: 'google.html',
  url: 'https://google.com',
  wait: 1000
}
```

`String` - selector of a node to look for. As soon as this node is found in DOM, the waiting will stop:

```js
{
  file: 'google.html',
  url: 'https://google.com',
  wait: '#footer'
}
```

If the selector is prefixed by "!", the waiting waiting will stop, if the node disappears from DOM:

```js
{
  file: 'google.html',
  url: 'https://google.com',
  wait: '!.gsfi'
}
```

`Function` - callback, which is supposed to return a `Promise`. Once this promise is resolved, the waiting will stop. The callback obtains the [webdriverio] client instance and can use [WebdriverIO API] to interact with the browser:

```js
{
  file: 'google.html',
  url: 'https://google.com',
  wait: function (browser) {
    return browser.waitForExist('#footer', 1000);
  }
}
```

`Array` - an array of items of types described above. They will be processed one by one. Once the last one is finished, the waiting will stop:

```js
{
  file: 'google.html',
  url: 'https://google.com',
  wait: [
    wait: '!.gsfi',
    200
  ]
}
```

If `wait` is omitted, the task will advance to another item without delay. It can still save a snapshot immediately.

### Parameter Combinations

The following array of commands within the `commands` property will change location, make a snapshot immediately to save the server-side pre-rendered content, then another one to see the progress after the first 500 milliseconds and yet another one, once the search form is ready. Then it submits the form by clicking on the "Search" button, waits until the search results are displayed and makes one final snapshot.

```js
{
  url: 'https://localhost/app'
  file: 'initial.html'
},
{
  wait: 500,
  file: 'after-500ms.html'
},
{
  wait: '#search',
  file: 'form-ready.html'
},
{
  wait: function (browser) {
    return browser.click('#search')
        .waitForExist('#results', 1000);
  },
  file: 'results-shown.html'
}
```

Other Grunt tasks can run later and validate, compare or otherwise process the page content in different stages of the "Search" scenario.

Navigating to other location, interacting with the page, waiting for some effect to show and saving a snapshot can be divided to different objects in the `commands` array. However, at least One of the `file`, `url` ans `wait` oarameters has to be present in ever object.

When the commands become too many, you can divide them per page or per other criterion, which corresponds with a scenario and load them from separate modules:

```js
'html-dom-snapshot': {
  addressbook: require('./test/scenarios/addressbook'),
  calendar: require('./test/scenarios/calendar'),
  inbox: require('./test/scenarios/inbox'),
  tasks: require('./test/scenarios/tasks')
}
```

The module for Addressbook would look like this:

```js
module.exports = {
  options: {...},
  commands: [
    {
      url: 'https://localhost/addressbook'
      wait: '#addressbook.complete'
    },
    ...
  ]
}
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
    'index.html': {
      url: 'https://localhost:8881'
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
      seleniumVersion: '3.7.1',
      seleniumDownloadURL: 'https://selenium-release.storage.googleapis.com',
      drivers: {
        chrome: {
          version: '2.33',
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

You will need to install [Java] 8 or newer to get the Selenium server running via the [selenium-standalone] Grunt task.

If you want to use the PhantomJS driver, you will need to install the `phantomjs-prebuilt` module:

```shell
$ npm install phantomjs-prebuilt --save-dev
```

The `phantomjs` binary will be accessible in `./node_modules/.bin`. If you do not start the Selenium server using `npm test` or other `npm run` command, you will had to add this directory to your `PATH`, otherwise the PhantomJS driver will not find the executable.

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding
style.  Add unit tests for any new or changed functionality. Lint and test
your code using Grunt.

## Release History

 * 2017-11-18   v0.1.0   Allow separate navigation, page interaction and saving snapshots
 * 2017-11-12   v0.0.1   Initial release

## License

Copyright (c) 2017 Ferdinand Prantl

Licensed under the MIT license.

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
[grunt-contrib-connect]: https://github.com/gruntjs/grunt-contrib-connect
[grunt-html]: https://github.com/jzaefferer/grunt-html
[grunt-accessibility]: https://github.com/yargalot/grunt-accessibility
[Java]: https://java.com/en/download/
