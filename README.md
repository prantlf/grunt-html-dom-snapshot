# grunt-html-dom-snapshot [![NPM version](https://badge.fury.io/js/grunt-html-dom-snapshot.png)](http://badge.fury.io/js/grunt-html-dom-snapshot) [![Dependency Status](https://david-dm.org/prantlf/grunt-html-dom-snapshot.svg)](https://david-dm.org/prantlf/grunt-html-dom-snapshot) [![devDependency Status](https://david-dm.org/prantlf/grunt-html-dom-snapshot/dev-status.svg)](https://david-dm.org/prantlf/grunt-html-dom-snapshot#info=devDependencies) [![devDependency Status](https://david-dm.org/prantlf/grunt-html-dom-snapshot/peer-status.svg)](https://david-dm.org/prantlf/grunt-html-dom-snapshot#info=peerDependencies)

[![Greenkeeper badge](https://badges.greenkeeper.io/prantlf/grunt-html-dom-snapshot.svg)](https://greenkeeper.io/)

[![NPM Downloads](https://nodei.co/npm/grunt-html-dom-snapshot.png?downloads=true&stars=true)](https://www.npmjs.com/package/grunt-html-dom-snapshot)

This module provides a grunt multi-task for taking snapshots of the HTML markup on web pages - their immediate DOM content - and saving them to files. It can be used to obtain content of web pages, which are built dynamically by JavaScript, and check it for validity and accessibility. It uses [webdriverio] and [Selenium] to control the selected web browser.

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
      url: 'http://www.google.com'
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
  }
  'google.html': {
    url: 'http://www.google.com'
  }
}
```

### Options

#### browserCapabilities
Type: `Object`
Default value: see above

Chooses the web browser to take snapshots with. Passed as `desiredCapabilities` to `webdriverio.remote`.

#### viewport
Type: `Object`
Default value: {width: 1024, height: 768}

Resizes the web browser viewport to the specified `width` and `height` values (in pixels) before taking snapshots.

#### selectorTimeout
Type: `Number`
Default value: 10000

Maximum waiting time, until a DOM node with the selector specified by the `wait` parameter appearts or disappears. Taking the snapshot fails, if this time is exceeded.

#### doctype
Type: `String`
Default value: '<!DOCTYPE html>'

Sets the HTML doctype to be written to the file with the snapshot. The API of [webdriverio] does not support getting its value. HTML validators require the doctype and to make the integration with other tasks easier it can be written to the snapshot file using this option.

#### dest
Type: `String`
Default value: 'snapshots'

Destination directory to write the page snapshots to. It will be created if it does not exist.

#### force
Type: `Boolean`
Default value: false

Suppresses failures, which happened during taking snapshots. Instead of making the Grunt fail, the errors will be written only to the console.

### Sub-tasks

File names for snapshots can be used as sub-task names. Separate sub-tasks initialize separate instance of the webdriver:

```js
'html-dom-snapshot': {
  'google.html': {
    url: 'http://google.com'
  },
  'github.html': {
    url: 'http://github.com'
  }
}
```

If the sub-task contains a property `pages`, this property is supposed to point to an array of snapshot requests. They share the same instance of the webdriver, which improves the performance:

```js
'html-dom-snapshot': {
  all: {
    pages: [
      {
        file: 'google.html',
        url: 'http://google.com'
      },
      {
        file: 'github.html',
        url: 'http://github.com'
      }
    ]
  }
}
```

### Parameters

#### file
Type: `String` (mandatory)

Name of the file to write the snapshot to.

```js
{
  file: 'google.html',
  url: 'http://google.com'
}
```

#### url
Type: `String` (mandatory)

URL to connect the web browser to for taking the snapshot.

```js
{
  file: 'google.html',
  url: 'http://google.com'
}
```

#### options
Type: `Object` (optional)

Options specific for taking snapshot of a one particular page. They will be merged with the task options to specialize taking of the particular snapshot:

```js
{
  file: 'google.html',
  url: 'http://google.com',
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
  url: 'http://google.com',
  wait: 1000
}
```

`String` - selector of a node to look for. As soon as this node is found in DOM, the waiting will stop:

```js
{
  file: 'google.html',
  url: 'http://google.com',
  wait: '#footer'
}
```

If the selector is prefixed by "!", the waiting waiting will stop, if the node disappears from DOM:

```js
{
  file: 'google.html',
  url: 'http://google.com',
  wait: '!.gsfi'
}
```

`Function` - callback, which is supposed to return a `Promise`. Once this promise is resolved, the waiting will stop. The callback obtains the [webdriverio] client instance:

```js
{
  file: 'google.html',
  url: 'http://google.com',
  wait: function (browser) {
    return browser.waitForExist('#footer', 1000);
  }
}
```

`Array` - an array of items of types described above. They will be processed one by one. Once the last one is finished, the waiting will stop:

```js
{
  file: 'google.html',
  url: 'http://google.com',
  wait: [
    wait: '!.gsfi',
    200
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
      url: 'http://localhost:8881'
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
      seleniumDownloadURL: 'http://selenium-release.storage.googleapis.com',
      drivers: {
        chrome: { // http://chromedriver.storage.googleapis.com/
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

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding
style.  Add unit tests for any new or changed functionality. Lint and test
your code using Grunt.

## Release History

 * 2017-11-12   v0.0.1   Initial release

## License

Copyright (c) 2017 Ferdinand Prantl

Licensed under the MIT license.

[node]: http://nodejs.org
[npm]: http://npmjs.org
[package.json]: https://docs.npmjs.com/files/package.json
[Grunt]: https://gruntjs.com
[Gruntfile]: http://gruntjs.com/sample-gruntfile
[Getting Gtarted]: https://github.com/gruntjs/grunt/wiki/Getting-started
[Selenium]: http://www.seleniumhq.org/download/
[webdriverio]: http://webdriver.io/
[selenium-standalone]: https://github.com/zs-zs/grunt-selenium-standalone
[grunt-contrib-connect]: https://github.com/gruntjs/grunt-contrib-connect
[grunt-html]: https://github.com/jzaefferer/grunt-html
[grunt-accessibility]: https://github.com/yargalot/grunt-accessibility
