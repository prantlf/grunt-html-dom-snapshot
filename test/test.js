'use strict'

const fs = require('fs')

function readPages (name, name2) {
  return {
    expected: readPage('pages/' + name),
    actual: readPage('snapshots/' + (name2 || name))
  }
}

function readPage (path) {
  const content = fs.readFileSync('test/' + path).toString()
  return content.replace(/\r|\n/g, '')
}

exports['html-dom-snapshot'] = {
  'single-target': function (test) {
    const pages = readPages('single-target.html')
    const screenshot = fs.existsSync('test/screenshots/single-target.png')
    test.equal(pages.expected, pages.actual, 'single-target.html')
    test.ok(!screenshot, 'single-target.png')
    test.done()
  },

  'static': function (test) {
    const snapshot = fs.existsSync('test/snapshots/static.html')
    const screenshot = fs.statSync('test/screenshots/002.static.png')
    test.ok(!snapshot, 'static.html')
    test.ok(screenshot.size > 1024, 'static.png')
    test.done()
  },

  'delayed': function (test) {
    const pages = readPages('delayed.html')
    const expected = pages.expected.replace('<body></body>', '<body>delayed</body>')
    test.equal(expected, pages.actual, 'delayed.html')
    test.done()
  },

  'dynamic': function (test) {
    const pages = readPages('dynamic.html')
    const expected = pages.expected.replace('<body>', '<body class="dynamic">')
    const screenshot = fs.statSync('test/screenshots/dynamic.png')
    test.equal(expected, pages.actual, 'dynamic.html')
    test.ok(screenshot.size > 1024, 'dynamic.png')
    test.done()
  },

  'dynamic-reverse': function (test) {
    const pages = readPages('dynamic-reverse.html')
    test.equal(pages.expected, pages.actual, 'dynamic-reverse.html')
    test.done()
  },

  'dynamic-delayed': function (test) {
    const pages = readPages('dynamic-delayed.html')
    const expected = pages.expected.replace('<body></body>', '<body class="dynamic">delayed</body>')
    test.equal(expected, pages.actual, 'dynamic-delayed.html')
    test.done()
  },

  'dynamic-custom': function (test) {
    const pages = readPages('dynamic-custom.html')
    const expected = pages.expected.replace('<body>', '<body class="dynamic">')
    test.equal(expected, pages.actual, 'dynamic-custom.html')
    test.done()
  },

  'no-doctype': function (test) {
    const pages = readPages('no-doctype.html', 'directory/001.no-doctype.html')
    test.equal(pages.expected, pages.actual, 'no-doctype.html')
    test.done()
  },

  'dynamic-multiple': function (test) {
    const original = readPage('pages/dynamic-multiple.html')
    const first = readPage('snapshots/dynamic-first.html')
    const second = readPage('snapshots/dynamic-second.html')
    const third = readPage('snapshots/dynamic-third.html')
    var expected = original
    test.equal(expected, first, 'dynamic-first.html')
    expected = original.replace('<body class="first">', '<body class="first second">')
    test.equal(expected, second, 'dynamic-second.html')
    expected = original.replace('<body class="first">', '<body class="first second third">')
    test.equal(expected, third, 'dynamic-third.html')
    test.done()
  },

  'scenario1': function (test) {
    const pages = readPages('scenario1.html')
    test.equal(pages.expected, pages.actual, 'scenario1.html')
    test.done()
  },

  'abort': function (test) {
    const snapshot = fs.existsSync('test/snapshots/abort.html')
    test.ok(!snapshot, 'abort.html')
    test.done()
  },

  'invalid-go': function (test) {
    test.ok(fs.existsSync('test/snapshots/_last-error.html'), '_last-error.html')
    test.ok(fs.existsSync('test/screenshots/_last-error.png'), '_last-error.png')
    test.done()
  }
}
