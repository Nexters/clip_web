var expect = require('chai').expect;
var rss = require('../rss');


describe('#fetchFeed', function () {
    it('should get error when invalid feed', function (done) {
        //given
        var feed = 'http://www.naver.com/rss';
        //when
        rss.fetchFeed(feed, function (err, feedData) {
            //then
            console.log(feedData);
            done();

        });
    });
});