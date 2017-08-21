const metafig = require('../../index');

require('should');

describe('Metafig', () => {
  it('should return your configuration in the same shape, with values filled in', () => {
    return metafig({
      hello: 'world',
      plugins: {
        gitlab: {
          awsParam: {
            path: '/metafig/',
            decryption: true
          }
        },
        jenkins: {
          awsS3: {
            Bucket: 'metafig-integration-test',
            Key: 'test.json'
          }
        }
      }
    })
      .then(config => {
        config.hello.should.eql('world');
        config.plugins.gitlab.integration.hello.should.eql('world');
        config.plugins.jenkins.hello.should.eql('world');
      });
  });
});
