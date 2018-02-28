<<<<<<< HEAD
'use strict';

module.exports = {
  detect: function (command) {
    return !!command.hasClass;
  },

  perform: function (grunt, target, client, command) {
    const hasClass = command.hasClass,
          selector = hasClass.selector,
          expected = hasClass.value || '',
          expectedList = expected.split(/ +/);
    grunt.log.ok('Looking for classes "' + expected + '" at "' +
                 selector + '".');
    return client.getAttribute(selector, 'class')
      .then(function (actual) {
        const actualList = (actual || '').split(/ +/),
              method = hasClass.allRequired ? 'every' : 'some';
        if (!expectedList[method](function (expected) {
              return expected.startsWith('!') ?
                actualList.indexOf(expected.substr(1)) < 0 :
                actualList.indexOf(expected) >= 0;
            })) {
          throw new Error ('Classes "' + expected +
            '" did not match classes "' + actual + '" at "' + selector + '".');
        }
      });
  }
};
||||||| merged common ancestors
=======
'use strict';

module.exports = {
  detect: function (command) {
    return !!command.hasClass;
  },

  perform: function (grunt, target, client, command) {
    const hasClass = command.hasClass,
          selector = hasClass.selector,
          expected = hasClass.value || '',
          expectedList = expected.split(/ +/);
    grunt.log.ok('Looking for classes "' + expected + '" at "' +
                 selector + '".');
    return client.getAttribute(selector, 'class')
      .then(function (actual) {
        const actualList = (actual || '').split(/ +/);
        if (!expectedList.some(function (expected) {
              return expected.startsWith('!') ?
                actualList.indexOf(expected.substr(1)) < 0 :
                actualList.indexOf(expected) >= 0;
            })) {
          throw new Error ('Classes "' + expected +
            '" were not found among "' + actual + '".at "' + selector + '".');
        }
      });
  }
};
>>>>>>> ed18031946de405cd074c973e2461622016d7c31
