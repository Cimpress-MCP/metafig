## METAFIG

**Metafig** is a library for loading configuration values from external
services like AWS Parameter Store, Environment Variables, S3 objects, etc.
All of this is configurable from a single place, making it easy to synthesize
different values from different locations.

### Why?

We had a bunch of lambda functions with a bunch of different configuration
methods. Some used S3 before lambda had encryption helpers for environment
variables. Some used environment variables. Some used the Parameter Store.

While we migrated most of them to the Parameter store, we wanted to:

1. Make it easier to mix-and-match
    * We had a few things too big for the Parameter Store
    * There are a few things that make more sense as environment variables.
2. Make it easier to migrate in the future if we change our mind.

### Example

`./config.json`
```json
{
  "plugins": {
    "database": {
      "awsParam": {
        "path": "/production/myapp/database",
        "decryption": true
      }
    },
    "api": {
      "awsParam": {
        "path": "/production/myapp/api",
        "decryption": true
      },
      "environment": {
        "baseUrl": "API_BASE_URL"
      }  
    }
  }
}
```

`./index.js`
```javascript
const metafig = require('metafig');
metafig(require('./config.json'), 'plugins')
  .then(config => {
    var db = new Db(config.plugins.database.connectionString);
    return db.query('SELECT * FROM MyTable');
  });
```

In this case, the `config` object looks something like:

```javascript
{
  plugins: {
    database: {
      connectionString: "sql://mydatabase.example.com:5678/db",
      username: "myApplication",
      password: "secret"
    },
    api: {
      token: "123456",
      baseUrl: "https://myapi.example.com"
    }
  }
}
```

As you can see, it pulled some items from environment variables, and some from
the AWS SSM Parameter Store.

### Providers

Metafig comes with 3 built-in configuration providers:

#### awsParam

The `awsParam` provider can pull down items from the AWS SSM Parameter Store.
It can take 2 parameters:

```javascript
"awsParam": {
  "path": "/app", // the path to the hierarchy in SSM to pull down
  "decryption": true // whether or not to decrypt SecureStrings
}
```

It will pull down every parameter listed under the specified path and put them
into the configuration object, nesting objects if there are deeper
configurations.

#### awsS3

The `awsS3` provider can pull down JSON configuration snippets as objects from
S3. It can accept any parameter for the [`getObject`](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getObject-property) API action:

```javascript
"awsS3": {
  "Bucket": "metafig-integration-test",
  "Key": "test.json"
}
```

It will pull down the specified object and run it through the JSON parser.

#### environment

The `environment` provider pulls values out of environment variables and maps
them to configuration items.

```javascript
"environment": {
  "myValue": "USERNAME"
}
```

Take the `USERNAME` environment variable and puts it into the `myValue` property
of your configuration.

#### literal

The `literal` provider just uses the literal value passed to it:

```javascript
"literal": {
  "username": "nmaclennan"
}
```
