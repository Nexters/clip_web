var Result = require('../services/Result');
var async = require('async');
var path = require('path');
var fs = require('fs');
var Busboy = require('busboy');
var config = require('../config/config');

var FILE_PREFIX = config.imgPrefix+'/upload/';

function FileCtrl() {

}

FileCtrl.checkFileSize = function (fileSize) {
    return function (req, res, next) {
        if (parseInt(req.headers['content-length']) > fileSize) {
            res.status(400).send(Result.ERROR('file size error'));
        } else {
            next();
        }
    };
};

FileCtrl.run = function (req, res) {
    var busboy = new Busboy({ headers: req.headers });
    var savedFileName, saveTo;

    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
        savedFileName = new Date().getTime() + "_" + filename;
        saveTo = path.join(__dirname, '../upload', savedFileName);
        console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
        console.log("SAVE PATH:", saveTo);
        file.pipe(fs.createWriteStream(saveTo));
    });
    busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated) {
        console.log('Field [' + fieldname);
    });
    busboy.on('finish', function () {
        res.set('Content-type', 'text/html; charset=utf-8');
        res.writeHead(200, { 'Connection': 'close' });
        res.write(JSON.stringify(Result.SUCCESS(FILE_PREFIX + savedFileName)));
        res.end();
    });
    return req.pipe(busboy);
};

module.exports = FileCtrl;


