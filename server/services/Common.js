var MobileDetect = require('mobile-detect');

function CommonService() {

}

CommonService.isMobile = function(req) {
    var md = new MobileDetect(req.headers['user-agent']);
    return md.mobile();
};


module.exports = CommonService;

