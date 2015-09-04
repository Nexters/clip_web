'use strict';

module.exports = {
    env: 'development',
    host: 'localhost',
    port: 3000,
    secret: 'clip_secret',
    imgPrefix: 'http://localhost:3000',
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