var request = require('request'),
    FeedParser = require('feedparser'),
    config = require('../server/config/config'),
    Iconv = require('iconv').Iconv,
    zlib = require('zlib'),
    async = require('async'),
    moment = require('moment'),
    log4js = require('log4js');

log4js.configure(config.log4js);
log4js.setGlobalLogLevel(config.logLevel);

var db = null;
var logger = log4js.getLogger("rss");

function getUsers(criteria, resultCallback) {
    db.user.find(criteria, resultCallback);
}

function getFeedDataFromUsers(users, resultCallback) {
    async.eachSeries(users, function iterator(user, callback) {
        if (!user || !user.keywords) return callback();
        if (user.keywords.length === 0) return callback();
        var updatedLastFeedDate = new Date();
        updateUserLastFeedDate(user._id, updatedLastFeedDate);
        fetchUserFeed(user._id, user.feeds, user.keywords, user.lastFeedDate, callback);
    }, function done() {
        if (resultCallback) resultCallback();
    });
}

function fetchUserFeed(userId, feedArray, keywordArray, lastFeedDate, resultCallback) {
    async.eachSeries(feedArray, function iterator(feed, callback) {
        fetch(userId, feed, keywordArray, lastFeedDate);
        callback();
    }, function done() {
        if (resultCallback) resultCallback();
    });
}

function maybeDecompress (res, encoding) {
    var decompress;
    if (encoding.match(/\bdeflate\b/)) {
        decompress = zlib.createInflate();
    } else if (encoding.match(/\bgzip\b/)) {
        decompress = zlib.createGunzip();
    }
    return decompress ? res.pipe(decompress) : res;
}

function maybeTranslate (res, charset) {
    var iconv;
    // Use iconv if its not utf8 already.
    if (!iconv && charset && !/utf-*8/i.test(charset)) {
        try {
            iconv = new Iconv(charset, 'utf-8');
            logger.info('Converting from charset %s to utf-8', charset);
            iconv.on('error', done);
            // If we're using iconv, stream will be the output of iconv
            // otherwise it will remain the output of request
            res = res.pipe(iconv);
        } catch(err) {
            logger.error('error: ',err);
        }
    }
    return res;
}

function getParams(str) {
    var params = str.split(';').reduce(function (params, param) {
        var parts = param.split('=').map(function (part) { return part.trim(); });
        if (parts.length === 2) {
            params[parts[0]] = parts[1];
        }
        return params;
    }, {});
    return params;
}

function done(err) {
    if (err) {
        logger.error(err, err.stack);
        return;
    }
    logger.info("rss end!");
    //process.exit();   // 프로세스 죽이지 않고 계속 배치로 작업 진행
}

function makeFeedData(userId, keywordArray, post, feed, pubDate) {
    var postKeywordArray = [];
    var keywordPattern, feedData;

    // 매칭되는 키워드 있는지 검사해서 매칭되는 키워드 postKeywordArray에 넣음
    // TODO: 향후 이 부분 수정해야함!
    keywordArray.forEach(function(keyword) {
        keywordPattern = new RegExp(keyword, "g");
        if (keywordPattern.test(post.description)) {
            postKeywordArray.push(keyword);
        }
    });

    feedData = {
        user: userId.valueOf().toString(),  // UserId to String
        title: post.title,
        description: post.description,
        link: post.link,
        source: feed,
        categories: post.categories,
        keywords: postKeywordArray,
        hasKeyword: (postKeywordArray.length > 0) ? true : false,
        pubDate: pubDate
    };
    return feedData;
}

function saveFeedData(postArray, resultCallback) {
    if (!postArray || postArray.length === 0) return resultCallback();

    async.eachSeries(postArray, function iterator(post, callback) {
        db.feed.count({user: post.user, link: post.link}, function(err, count) {
            if (count > 0) return callback();
            db.feed.insert(post, function(err) {
                callback();
            });
        });
    }, function done() {
        if (resultCallback) resultCallback();
    });
}

function updateUserLastFeedDate(userId, lastFeedDate, callback) {
    logger.info("Update user lastFeedDate: ", lastFeedDate);
    db.user.update({_id:userId}, {$set:{lastFeedDate: lastFeedDate}}, function(err) {
        if (callback) callback(err);
    });
}

function setDB(inDB) {
    db = inDB;
}
exports.setDB = setDB;

function getNeedCollections() {
    return ["user", "feed"];
}
exports.getNeedCollections = getNeedCollections;

function fetchFeed(feed, finalCallback) {
    // Define our streams
    var req = request(feed, {timeout: 10000, pool: false});
    req.setMaxListeners(50);
    // Some feeds do not respond without user-agent and accept headers.
    req.setHeader('user-agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36');
    req.setHeader('accept', 'text/html,application/xhtml+xml');

    var feedparser = new FeedParser();


    // Define our handlers
    req.on('error', done);
    req.on('response', function(res) {
        if (res.statusCode !== 200) {
            return this.emit('error', new Error('Bad status code'));
        }
        var encoding = res.headers['content-encoding'] || 'identity'
            , charset = getParams(res.headers['content-type'] || '').charset;
        res = maybeDecompress(res, encoding);
        res = maybeTranslate(res, charset);
        res.pipe(feedparser);
    });

    feedparser.on('error', done);
    feedparser.on('end', done);
    feedparser.on('readable', function() {
        var post;
        while (post = this.read()) {
            finalCallback(null, post);
        }
    });
}
exports.fetchFeed = fetchFeed;

function fetch(userId, feed, keywordArray, lastFeedDate) {
    // Define our streams
    var req = request(feed, {timeout: 10000, pool: false});
    req.setMaxListeners(50);
    // Some feeds do not respond without user-agent and accept headers.
    req.setHeader('user-agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36')
    req.setHeader('accept', 'text/html,application/xhtml+xml');

    var feedparser = new FeedParser();

    // Define our handlers
    req.on('error', done);
    req.on('response', function(res) {
        if (res.statusCode != 200) return logger.error("res.statusCode: ", res.statusCode);
        var encoding = res.headers['content-encoding'] || 'identity'
            , charset = getParams(res.headers['content-type'] || '').charset;
        res = maybeDecompress(res, encoding);
        res = maybeTranslate(res, charset);
        res.pipe(feedparser);
    });

    feedparser.on('error', done);
    feedparser.on('end', done);
    feedparser.on('readable', function() {
        var postArray = [];
        var post;
        while (post = this.read()) {
            var lastDate = moment(lastFeedDate);
            var pubDate = moment(post.pubDate);
            if (lastDate.isBefore(pubDate)) {
                postArray.push(makeFeedData(userId, keywordArray, post, feed, pubDate.toDate()));
            }
        }
        logger.info('postArray:',postArray.length);
        saveFeedData(postArray, function(err) {
            if (err) logger.error("saveFeedData err: ",err);
        });
    });
}
exports.fetch = fetch;

function run(resultCallback) {
    async.waterfall([
        function(callback){
            var criteria = {};
            getUsers(criteria, function(err, users) {
                callback(err, users);
            });
        },
        function(users, callback) {
            logger.info("users.length: ", users.length);
            getFeedDataFromUsers(users, function(err) {
                callback(users, err);
            });
        }
    ], function(err){
        if(err) logger.error(err);
        if(resultCallback) resultCallback(err);
    });
}
exports.run = run;
