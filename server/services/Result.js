function ResultService() {

}

ResultService.SUCCESS = function (data, msg) {
    var result = {
        resultCode: 0,
        resultMsg: msg ? msg : "SUCCESS",
        data: data ? data : "SUCCESS"
    };
    return result;
};

ResultService.ERROR = function (errors, msg) {
    var result = {
        resultCode: 1,
        resultMsg: msg ? msg : "ERROR",
        errors: errors ? errors : [ "ERROR" ]
    };
    return result;
};

module.exports = ResultService;


