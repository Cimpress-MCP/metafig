const metafig = require('../index');

require('should');

before(() => {
  process.env.TEST_1 = 'test value one';
  process.env.TEST_2 = 'test value two';
  process.env.TEST_3 = 'test value three';
});

describe('Metafig', () => {
  it('should return your configuration in the same shape, with values filled in', () => {
    return metafig({
      hello: 'world',
      plugins: {
        gitlab: {
          environment: {
            user: 'TEST_1',
            profile: 'TEST_2'
          }
        },
        jenkins: {
          environment: {
            location: 'TEST_3'
          },
          literal: {
            username: 'jdoe'
          }
        }
      }
    })
      .then(config => {
        config.hello.should.eql('world');
        config.plugins.gitlab.user.should.eql(process.env.TEST_1);
        config.plugins.gitlab.profile.should.eql(process.env.TEST_2);
        config.plugins.jenkins.location.should.eql(process.env.TEST_3);
        config.plugins.jenkins.username.should.eql('jdoe');
      });
  });

  it('should optionally accept a target path in the configuration object', () => {
    return metafig({
      hello: 'world',
      notplugins: {
        gitlab: {
          environment: {
            user: 'TEST_1',
            profile: 'TEST_2'
          }
        },
        jenkins: {
          environment: {
            location: 'TEST_3'
          },
          literal: {
            username: 'jdoe'
          }
        }
      }
    }, 'notplugins')
      .then(config => {
        config.hello.should.eql('world');
        config.notplugins.gitlab.user.should.eql(process.env.TEST_1);
        config.notplugins.gitlab.profile.should.eql(process.env.TEST_2);
        config.notplugins.jenkins.location.should.eql(process.env.TEST_3);
        config.notplugins.jenkins.username.should.eql('jdoe');
      });
  });

  it('should not touch items outside of the specified target', () => {
    return metafig({
      hello: {
        place: 'world'
      },
      plugins: {
        gitlab: {
          environment: {
            user: 'TEST_1'
          }
        }
      }
    })
      .then(config => {
        config.hello.place.should.eql('world');
      });
  });

  it('should throw an error if it cannot find a setting with a plugin', () => {
    return metafig({
      plugins: {
        database: {
          environment: {
            hostname: 'RDS_HOSTNAME'
          }
        }
      }
    })
      .then(config => {
        throw new Error('This should not have succeeded.');
      })
      .catch(err => {
        err.message.should.eql('No environment variable: RDS_HOSTNAME!');
      });
  });

  it('should not mutate the object passed in', () => {
    const file = {
      plugins: {
        database: {
          environment: {
            hostname: 'TEST_1'
          }
        }
      }
    };

    return metafig(file)
      .then(config => {
        config.plugins.database.hostname.should.eql('test value one');
        file.plugins.database.environment.hostname.should.eql('TEST_1');
        return metafig(file);
      })
      .then(config => {
        config.plugins.database.hostname.should.eql('test value one');
        file.plugins.database.environment.hostname.should.eql('TEST_1');
      });
  });
});
