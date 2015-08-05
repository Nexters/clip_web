/**
 * Created by 201101575 on 2015-07-20.
 */

function start() {
    console.log("Request handler 'start' was called.");
    return "Hello Start";
}

function hello() {
    console.log("Request handler 'hello' was called");
    return "Hello Hello";
}

function bbangtle(response) {
    console.log("Request handler 'bbangtle' was called");
    var body = '<html>'+'<head>'+
        '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />'+
        '</head>'+ '<body>' +
        '<p>'+ query.name + '입니다.' + '</p>'+'<br>'+
        '<p>'+ query.test + '입니다.' + '</p>'+'<br>'+

        '</body>' + '</html>';

    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();
}

exports.start = start;
exports.hello = hello;
exports.bbangtle = bbangtle;