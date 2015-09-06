var MobileDetect = require('mobile-detect');

function CommonService() {

}

CommonService.isMobile = function(req) {
    var md = new MobileDetect(req.headers['user-agent']);
    return md.mobile();
};

CommonService.randomPassword = function() {
    var tmpTime = new Date();
    return "clip" + Math.ceil((Math.floor((Math.random() * 100) + 1) * (tmpTime % 100)) / 2);
};

module.exports = CommonService;

