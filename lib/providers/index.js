'use strict';
const promisify = require('es6-promisify'),
  fs = require('fs'),
  path = require('path'),
  ls = promisify(fs.readdir);

module.exports.loadProviders = function loadProviders () {
  return ls(path.resolve(__dirname, '.'))
    .then((providers) => {
      return providers.filter(p => p !== path.basename(__filename)).map(p => p.replace('.js', ''));
    });
};

function getProvider (provider) {
  return module.exports.loadProviders()
    .then(providers => {
      if (providers.indexOf(provider) > -1) {
        return require(`./${provider}`);
      } else {
        throw new Error(`Invalid provider: ${provider}`);
      }
    });
}

module.exports.getSettingsFromProvider = function getSettingsFromProvider (provider, config) {
  return getProvider(provider)
    .then(provider => {
      return provider(config);
    });
};
