var Crawler = require('crawler');
var url = require('url');

var KEYWORD_ARRAY = ["창업"];

var c = new Crawler({
    maxConnections : 10,
    // This will be called for each crawled page
    callback : function (error, result, $) {
        $('a').each(function(index, a) {
            var toQueueUrl = $(a).attr('href');
            c.queue(toQueueUrl);
        });

        $('a').each(function(index, result) {
            var child = $(result).find('img');
            if (child.length > 0) {
                var link = $(result).attr('href');
                var img = $(child).attr('src');

                console.log(link);
                console.log(img);
            }
        });

        $('li.g').each(function(index, result) {
            var title = $(result).find('h3.r a').text();
            var link = $(result).find('h3.r a').attr('href');
            var detail = $(result).find('span.st').text();

            console.log(title);
            console.log(link);
            console.log(detail);
        });

        $('td a.fl').each(function(index, a) {
            var toQueueUrl = "http://google.fr"+$(a).attr('href');
            setTimeout(function(){
                c.queue(toQueueUrl);
            }, 3000);
        });
    }
});

// Queue using a function
var googleSearch = function(search) {
    return 'http://www.google.fr/search?q=' + search;
};

c.queue({
    uri: googleSearch(KEYWORD_ARRAY[0])
});

c.queue({
    uri: 'http://www.venturesquare.net/'
});