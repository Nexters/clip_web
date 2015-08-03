/**
 * Created by 201101575 on 2015-07-13.
 */
var http = require("http");

http.createServer(function (request, response) {
    response.writeHead(200, {"Content-Type" : "text/plain"});
    response.write("HelloWorld");
    console.log(http);
    response.end();
}).listen(8888);