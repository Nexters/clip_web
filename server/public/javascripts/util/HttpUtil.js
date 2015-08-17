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
            if (data.resultCode === 0) {
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
        contentType: 'application/json;charset=UTF-8',
        dataType: 'json',
        data: JSON.stringify(params),
        error: function errorHandler(jqXHR, textStatus, errorThrown) {
            callback("Error", null);
        },
        success: function successHandler(data, status, xhr) {
            if (data.resultCode === 0) {
                callback(null, data.data);
            } else {
                callback("Error", data.errors);
            }
        }
    });
};

HttpUtil.putData = function(url, params, callback) {
    $.ajax({
        url: url,
        type: 'PUT',
        contentType: 'application/json;charset=UTF-8',
        dataType: 'json',
        data: JSON.stringify(params),
        error: function errorHandler(jqXHR, textStatus, errorThrown) {
            callback("Error", null);
        },
        success: function successHandler(data, status, xhr) {
            if (data.resultCode === 0) {
                callback(null, data.data)
            } else {
                callback("Error", null);
            }
        }
    });
};