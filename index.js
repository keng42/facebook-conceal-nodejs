/* eslint-disable global-require */
if (process.browser) {
  module.exports = require('./lib/browser');
} else {
  module.exports = require('./lib');
}
