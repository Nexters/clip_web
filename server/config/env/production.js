'use strict';

module.exports = {
    env: 'production',
    host: 'godong9.com',
    port: 9000,
    secret: 'clip_secret',
    imgPrefix: 'http://godong9.com:9000',
    mongo: {
        uri: 'mongodb://localhost/',
        db: 'clip',
        username: '',
        password: ''
    },
    log4js: {
        "appenders": [
            {
                "type": "dateFile",
                "absolute": true,
                "filename": "/logs/server.log",
                "pattern":"-yyyy-MM-dd",
                "alwaysIncludePattern": true
            }
        ]
    },
    logLevel: 'info'
};