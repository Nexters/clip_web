function HttpUtil() {

}

HttpUtil.getData = function(url, params, callback) {
    $.ajax({
        url: url,
        type: 'GET',
        data: params,
        error: function errorHandler(jqXHR, textStatus, errorThrown) {
            callback("Error");
        },
        success: function successHandler(data, status, xhr) {
            if (data.code === 0) {
                callback(null, data.data)
            } else {
                callback("Error");
            }
        }
    });
};

HttpUtil.postData = function(url, params, callback) {
    $.ajax({
        url: url,
        type: 'POST',
        data: params,
        error: function errorHandler(jqXHR, textStatus, errorThrown) {
            callback("Error");
        },
        success: function successHandler(data, status, xhr) {
            if (data.code === 0) {
                callback(null, data.data)
            } else {
                callback("Error");
            }
        }
    });
};

