'use strict';
const {getSettingsFromProvider} = require('./lib/providers'),
  _ = require('lodash');

/**
 * Turn an array of disparate objects into a single object.
 *
 * @example
 * // returns {a: 'b', c: 'd'}
 * arrayToObject([{a: 'b'}, {c: 'd'}])
 *
 * @param {array} array - The array to transform
 * @param {object} object - The object constructed from the array
 */
function arrayToObject (array) {
  return array.reduce(function (acc, x) {
    for (var key in x) acc[key] = x[key];
    return acc;
  }, {});
}

/**
 * Load a configuration object using provider plugins.
 *
 * @example
 * // returns {gitlab: {user: process.env.USER}}
 * loadPluginConfig('gitlab', {environment: {user: 'USER'}})
 *
 * @param {string} plugin - The name of the plugin this configuration is for
 * @param {object} settings - The settings to load for the object
 */
function loadPluginConfig (plugin, settings) {
  const loadingTasks = [];
  Object.keys(settings).forEach((provider) => {
    loadingTasks.push(getSettingsFromProvider(provider, settings[provider]));
  });

  return Promise.all(loadingTasks)
    .then(loadedSettings => {
      return {[plugin]: arrayToObject(loadedSettings)};
    });
}

/**
 * Hydrate settings from the target key in an object from all providers
 *
 * @example
 * // returns {gitlab: {user: process.env.USER}}
 * loadAllFromTarget({plugins: {gitlab: {environment: {user: 'USER'}}}}, 'plugins')
 *
 * @param {object} config - The configuration file you wish to hydrate
 * @param {string} target - The path to the key in your config to be hydrated (e.g. 'a.b[0].c')
 */
function loadAllFromTarget (config, target) {
  let configLoaders = [];
  const targetObj = _.get(config, target, {});

  Object.keys(targetObj).forEach((plugin) => {
    configLoaders.push(loadPluginConfig(plugin, targetObj[plugin]));
  });

  return configLoaders;
}

module.exports = (config, target = 'plugins') => {
  return Promise.all(loadAllFromTarget(config, target))
    .then(values => {
      values = arrayToObject(values);
      _.set(config, target, values);

      return config;
    });
};
