/**
 * Created by 201101575 on 2015-07-29.
 */
var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next){
    console.log('req.body : ' + req.body);
    if(req.body.email == 'test@test' && req.body.password == 'testpw'){
        res.send("�α����� �Ǿ����ϴ�");
    } else {
        res.send("�α��� ����");
    }
});

module.exports = router;