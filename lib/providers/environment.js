'use strict';

module.exports = (mapping) => {
  return new Promise((resolve, reject) => {
    let settingsObj = {};
    Object.keys(mapping).forEach(setting => {
      if (!process.env.hasOwnProperty(mapping[setting])) {
        throw new Error(`No environment variable: ${mapping[setting]}!`);
      }

      settingsObj[setting] = process.env[mapping[setting]];
    });

    resolve(settingsObj);
  });
};
