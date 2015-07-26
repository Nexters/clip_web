var request = require('request'),
    FeedParser = require('feedparser'),
    Iconv = require('iconv').Iconv,
    zlib = require('zlib'),
    async = require('async'),
    moment = require('moment'),
    log4js = require('log4js');

log4js.configure(__dirname+'/../config/log4js_config.json');
log4js.setGlobalLogLevel('debug');

var db = null;
var logger = log4js.getLogger("rss");


function getUsers(criteria, resultCallback) {
    db.user.find(criteria, resultCallback);
}

function getFeedDataFromUsers(users, resultCallback) {
    async.eachSeries(users, function iterator(user, callback) {
        if (user.keyword.length === 0) return callback();
        var keywordString = user.keyword.join('|');
        var keywordPattern = new RegExp(keywordString, "g");
        fetchUserFeed(user.feed, keywordPattern, user.lastFeedDate, callback);
    }, function done() {
        if (resultCallback) resultCallback();
    });
}

function fetchUserFeed(feedArray, keywordPattern, lastFeedDate, resultCallback) {
    async.eachSeries(feedArray, function iterator(feed, callback) {
        fetch(feed, keywordPattern, lastFeedDate);
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
            res.emit('error', err);
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
        return process.exit(1);
    }
    logger.info("rss end!");
    //process.exit();   // 프로세스 죽이지 않고 계속 배치로 작업 진행
}


function setDB(inDB) {
    db = inDB;
}
exports.setDB = setDB;

function getNeedCollections() {
    return ["web", "user"];
}
exports.getNeedCollections = getNeedCollections;

function fetch(feed, keywordPattern, lastFeedDate) {
    // Define our streams
    var req = request(feed, {timeout: 10000, pool: false});
    req.setMaxListeners(50);
    // Some feeds do not respond without user-agent and accept headers.
    req.setHeader('user-agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36');
    //.setHeader('accept', 'text/html,application/xhtml+xml');

    var feedparser = new FeedParser();

    // Define our handlers
    req.on('error', done);
    req.on('response', function(res) {
        if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));
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
            if (keywordPattern.test(post.description)) {
                // TODO: post.pubDate와 lastFeedDate 비교해서 lastFeedDate 이후의 것만 db에 저장하는 로직 추가
                var lastDate = moment(lastFeedDate);
                var pubDate = moment(post.pubDate);
                if (lastDate.isBefore(pubDate)) {
                    logger.info(post);  // TODO: post db에 저장하는 로직 추가 (Web Schema)
                    // TODO: user의 lastFeedDate 업데이트 필요!
                }
            }
        }
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
        function(users, callback){
            logger.info("users: ", users);
            getFeedDataFromUsers(users, function(err) {
                callback(err);
            });
        }
    ], function(err){
        if(err) logger.error(err);
        if(resultCallback) resultCallback(err);
    });
}
exports.run = run;
