const awsParam = require('../../../lib/providers/awsS3');

require('should');

describe('AwsS3', () => {
  it('should load a json file from s3', () => {
    return awsParam({
      Bucket: 'metafig-integration-test',
      Key: 'test.json'
    })
      .then(params => {
        params.hello.should.eql('world');
        params.this.is.a.json.should.eql('object');
      });
  });

  it('should throw if there is a problem', () => {
    return awsParam({
      Bucket: 'metafig-integration-test',
      Key: 'test.nothing'
    })
      .then(params => {
        throw new Error('This should not happen.');
      })
      .catch(err => {
        err.message.should.eql('The specified key does not exist.');
      });
  });
});
