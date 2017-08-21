const { getSettingsFromProvider, loadProviders } = require('../lib/providers');

require('should');

describe('Providers', () => {
  describe('#loadProviders', () => {
    it('should detect the three local providers', () => {
      return loadProviders()
        .then(providers => {
          providers.should.eql(['awsParam', 'awsS3', 'environment', 'literal']);
        });
    });
  });

  describe('#getSettingsFromProvider', () => {
    it('should load config from environment variables', () => {
      process.env.TEST1 = 'test value 1';
      process.env.TEST2 = 'this is also a test value';

      return getSettingsFromProvider('environment', {
        testValue: 'TEST1', anotherTest: 'TEST2'
      })
        .then(settings => {
          settings.testValue.should.eql(process.env.TEST1);
          settings.anotherTest.should.eql(process.env.TEST2);
        });
    });

    it('should return literal config un-munged', () => {
      return getSettingsFromProvider('literal', {
        testValue: 'TEST1', anotherTest: 'TEST2'
      })
        .then(settings => {
          settings.testValue.should.eql('TEST1');
          settings.anotherTest.should.eql('TEST2');
        });
    });

    it('should fail when trying to use a non-existent provider', () => {
      return getSettingsFromProvider('foobar', { a: 'b', c: 'd' })
        .then(() => {
          throw new Error('Something went wrong!');
        })
        .catch(error => {
          error.should.be.an.Error();
          error.message.should.eql('Invalid provider: foobar');
        });
    });
  });
});
