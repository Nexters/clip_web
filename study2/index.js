/**
 * Created by 201101575 on 2015-07-20.
 */
//index.js
var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

// path와 연결되는 함수의 정보를 저장.
var handle = {}
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/hello"] = requestHandlers.hello;
handle["/bbangtle"] = requestHandlers.bbangtle;

server.start(router.route, handle);