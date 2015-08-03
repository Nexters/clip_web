/**
 * Created by 201101575 on 2015-07-20.
 */
// server.js
var http = require("http");
var url = require("url");
var querystring = require("querystring");

function start(route, handle) {
    function onRequest(request, response) {
        var query = url.parse(request.url).query;
        //var queryString = request.url.split('?')[1]; //? 뒤의 값을 쿼리 스트링에 넣기
        //var queryString = pathname.query;
        //var a = querystring.stringify(queryString)[0]; // a 는 첫번째 인자를 쿼리 문자열
        //var b = querystring.stringify(queryString)[1]; // b 는 두번째 인자를 쿼리 문자열
        //querystring.parse('a'= request.parse(queryString)["a"]&b=request.parse(queryString)["b"]');
        //console.log(a);
        //console.log(b);
        //console.log("Request for" + pathname + "received.");
        response.writeHead(200, {"Content-Type": "text/html"});
        var content = route(handle, query, response);
        //response.write(content);
        response.end();
    }

    http.createServer(onRequest).listen(8888);
    console.log("Server has started.");
}

exports.start = start;