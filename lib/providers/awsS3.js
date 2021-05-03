'use strict';

const { S3 } = require('aws-sdk'),
  s3 = new S3();

module.exports = (params) => {
  return new Promise((resolve, reject) => {
    s3.getObject(params, (err, data) => {
      if (err) return reject(err, err.stack);
      else resolve(JSON.parse(data.Body));
    });
  });
};
