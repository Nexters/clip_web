var schedule = require('node-schedule'),
    log4js = require('log4js'),
    async = require('async'),
    mongojs = require('mongojs'),
    config = require('../server/config/config'),
    rss = require('../rss/rss');

var MODE = null;

process.argv.forEach(function(argv){
    if(argv.indexOf('mode') !== -1){
        MODE = argv.split('=')[1].replace(/(^\s*)|(\s*$)/gi, "");
    }
});

if (!MODE) {
    console.log("batch.js mode=[development,production]");
    process.exit(1);
}

log4js.configure(config.log4js);
log4js.setGlobalLogLevel(config.logLevel);

var logger = log4js.getLogger("batch");

var jobs = [
    {
        rule: function(){
            var rule = new schedule.RecurrenceRule();
            if(MODE === "development"){
                rule.second = 1;
            }else {
                rule.minute = 0;
            }
            return rule;
        },
        init: function(db, callback){
            rss.setDB(db);
            rss.run(function(err){
                if(callback) callback(err);
            });
        },
        run: rss.run,
        getNeedCollections: rss.getNeedCollections
    }
];


// batch들은 하나의 db connection만 유지
function init() {
    var needCollections = [];
    var initFunctions = [];
    var i;
    // batch들에서 필요한 collections 모두 추가
    for (i=0; i<jobs.length; i++) {
        var job = jobs[i];
        needCollections = needCollections.concat(job.getNeedCollections());
    }

    var db = mongojs('mongodb://localhost/clip', needCollections);

    function getInitFunction(job, db){
        return function(callback){
            job.init(db, function(err){
                callback(err);
            });
        }
    }
    for (i=0; i<jobs.length; i++) {
        initFunctions.push(getInitFunction(jobs[i],db));
    }

    async.series(
        initFunctions
        ,function(){
            for (i=0; i<jobs.length; i++) {
                // job을 스케쥴에 넣음.
                schedule.scheduleJob(jobs[i].rule(), jobs[i].run);
            }
        });
}

logger.info("Start batch server");

init();

process.on('uncaughtException', function(err) {
    console.log("ERR: ",err);
    logger.error("Uncaught Exception", err);
    process.exit(1);
});