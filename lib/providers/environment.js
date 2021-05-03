'use strict';

module.exports = (mapping) => {
  return new Promise((resolve, reject) => {
    const settingsObj = {};
    Object.keys(mapping).forEach(setting => {
      if (!(mapping[setting] in process.env)) {
        throw new Error(`No environment variable: ${mapping[setting]}!`);
      }

      settingsObj[setting] = process.env[mapping[setting]];
    });

    resolve(settingsObj);
  });
};
