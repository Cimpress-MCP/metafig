const awsParam = require('../../../lib/providers/awsParam');

require('should');

describe('AwsParam', () => {
  it('should recursively load a params path', () => {
    return awsParam({
      path: '/metafig/'
    })
      .then(params => {
        params.integration.hello.should.eql('world');
      });
  });

  it('should optionally decrypt encrypted params', () => {
    return awsParam({
      path: '/metafig/',
      decryption: true
    })
      .then(params => {
        params.integration.hello.should.eql('world');
        params.integration.encrypted.should.eql('decrypted');
      });
  });
});
