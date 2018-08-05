const crawler = require('./Crawler.js');
const async = require('async');
const fs = require('fs');

// function scanFromFile() {
//     //scan from file
//     async.auto({
//         func1: function (cb, res) {
//             crawler.setDefRules();
//             cb(null);
//         },
//         func2: function (cb, res) {
//             crawler.scanFromFile('seo.html');

//             cb(null);
//         },
//         func3: function (cb, res) {
//             crawler.runRules(function () {
//                 //print in console
//                 crawler.printResultByConsole();
//             });
//             cb(null);
//         }
//     }, function (err, res) {
//         //   console.log(res);
//     });
// };

// function scanFromUrl() {
//     async.auto({
//         func1: function (cb, res) {
//             crawler.setDefRules();
//             cb(null);
//         },
//         func2: function (cb, res) {
//             //scan from url
//             crawler.scanFromUrl('https://moz.com/learn/seo/what-is-seo', 'GET');
//             cb(null);
//         },
//         func3: function (cb, res) {
//             crawler.runRules(function () {
//                 //save result in file
//                 crawler.printResultByFile('result.txt');
//             });
//             cb(null);
//         }
//     }, function (err, res) {
//         //   console.log(res);
//     });
// };

// function scanFromStream() {
//     async.auto({
//         func1: function (cb, res) {
//             crawler.setDefRules();
//             cb(null);
//         },
//         func2: function (cb, res) {
//             //scan from stream
//             let input = fs.createReadStream('seo.html');
//             crawler.getStreamFromFile(input, function (content) {
//                 crawler.setHtmlBody(content);
//             });
//             cb(null);
//         },
//         func3: function (cb, res) {
//             crawler.runRules(function () {
//                 //print in console
//                 crawler.printResultByConsole();
//             });
//             cb(null);
//         }
//     }, function (err, res) {
//         //   console.log(res);
//     });
// };

function scan(setRueCb, scanCb, runCb, clearCb) {
    async.auto({
        func1: function (cb, res) {
            setRueCb();
        },
        func2: function (cb, res) {
            scanCb();
        },
        func3: function (cb, res) {
            runCb();
        },
        func4: function (cb, res) {
            clearCb();
        }
    }, function (err, res) {
        //   console.log(res);
    });
};

//scan from read stream, and output in console
scan(function () {
    crawler.setDefRules();
}, function () {
    let input = fs.createReadStream('seo.html');
    crawler.getStreamFromFile(input, function (content) {
        crawler.setHtmlBody(content);
    });
}, function () {
    crawler.runRules(function () {
        //print in console
        crawler.printResultByConsole();
    });
}, function () {
    crawler.clearResult();
});

//scan from url, and output to  console
scan(function () {
    crawler.setDefRules();
}, function () {
    crawler.scanFromUrl('https://moz.com/learn/seo/what-is-seo', 'GET');
}, function () {
    crawler.runRules(function () {
        //print in console
        crawler.printResultByConsole();
    });
}, function () {
    crawler.clearResult();
});

//scan from file, and output in a file
scan(function () {
    crawler.setDefRules();
}, function () {
    crawler.scanFromFile('seo.html');
}, function () {
    crawler.runRules(function () {
        crawler.runRules(function () {
            //print in console
            crawler.printResultByFile('result.txt');
        });
    });
}, function () {
    crawler.clearResult();
});

//scan from file, and output by writeable stream
scan(function () {
    crawler.setDefRules();
}, function () {
    crawler.scanFromFile('seo.html');
}, function () {
    crawler.runRules(function () {
        crawler.runRules(function () {
            crawler.printResultByWriteableStream('wsresult.txt',function(ws){
                ws.end();
            });
        });
    });
}, function () {
    crawler.clearResult();
});

