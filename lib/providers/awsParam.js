'use strict';

const {ssmToObjByPath} = require('ssm-params'),
  promisify = require('es6-promisify'),
  getParams = promisify(ssmToObjByPath);

module.exports = (params) => {
  return getParams({
    Path: params.path,
    nestObject: true,
    WithDecryption: params.decryption
  });
};
