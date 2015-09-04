var express = require('express');
var router = express.Router();
var fileCtrl = require('../controllers/File');

var FILE_UPLOAD_LIMIT_SIZE = 10 * 1024 * 1024; // 10mb

/**
 * ---------
 * ## **POST file upload**
 *  - 파일 업로드 API
 *
 * ### URL: /file
 * ### TYPE: POST
 *
 * @param {Multipart} files - 파일 데이터
 *
 * @example
 *  REQUEST
 *   - POST /file
 *  RESPONSE
 *   - {"resultCode":0,"resultMsg":"SUCCESS","data":"http://localhost:3000/upload/1439046961238_gd.png"}
 */
router.route('/').post(fileCtrl.checkFileSize(FILE_UPLOAD_LIMIT_SIZE), fileCtrl.run);

module.exports = router;
