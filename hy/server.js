/**
 * Created by 201101575 on 2015-07-13.
 */
// server.js

/* �⺻���� �����
http.createServer(function (request, response) {
    response.writeHead(200, {"Content-Type" : "text/plain"});
    response.write("Hello World!");
    response.end();
}).listen(8888);
    */

/* �⺻���� ����� - �Լ� ����
function onRequest(request, response) {
    console.log("Request Received");
    response.writeHead(200, {"Content-Type" : "text/plain"});
    response.write("Hello World");
    response.end();
}

http.createServer(onRequest).listen(8888);
console.log("Server has started.");
    */

/* �⺻���� ����� - ���ȭ*/
/* http = require("http");

function start() {
    function onRequest(request, response) {
        console.log("Request Received");
        response.writeHead(200, {"Content-Type" : "text/plain"});
        response.write("Hello World");
        response.end();
    }

    http.createServer(onRequest).listen(8888);
    console.log("Server has started.");
}

exports.start = start; */

/*��û�� route*/
/*    function onRequest(request, response) {
        var postData = "";
        var pathname = url.parse(request.url).pathname;
        console.log("Request for " + pathname + "received.");

        request.setEncoding("utf8");

        request.addListener("data", function(postDataChunk) {
            postData += postDataChunk;
            console.log("Received POST data chunk '"+
            postDataChunk + "'.");
        });

        request.addListener("end", function () {
            route(handle, pathname, response, postData);
        });
    }*/
var http = require("http");

http.createServer(function (request, response) {
    response.writeHead(200, {"Content-Type" : "text/plain"});
    response.write("HelloWorld");
    console.log(http);
    //response.end();
}).listen(8888);