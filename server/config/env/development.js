'use strict';

module.exports = {
    env: 'development',
    host: 'localhost',
    port: 3000,
    secret: 'clip_secret',
    mongo: {
        uri: 'mongodb://localhost/',
        db: 'clip',
        username: '',
        password: ''
    },
    log4js: {
        "appenders": [
            {
                "type":"console"
            }
        ]
    },
    logLevel: 'debug'
};