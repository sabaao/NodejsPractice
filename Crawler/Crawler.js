const request = require("request");
const cheerio = require('cheerio');
const fs = require('fs');

module.exports = {
    rules: [],
    inputFilePath: '',
    outputFilePath: '',
    result: [],
    htmlBody: '',

};

function setHtmlBody(body) {
    module.exports.htmlBody = body;
};

function setHtmlBodyByFile(filePath) {
    console.log('file path is ' + filePath);
    fs.readFile(filePath, function (err, data) {
        let setBody = module.exports.setHtmlBody(data.toString());
        // module.exports.htmlBody = '' + data.toString();
    });
};

function setHtmlBodyByStream(stream) {

};

function printResultByConsole() {
    console.log('this is printResultByConsole');
    console.log(module.exports.result);
};

function printResultByFile(filePath) {
    fs.writeFile(filePath, module.exports.result, function (err) {
        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    });
};

function printResultByWriteableStream(filePath,callback) {
    const ws = fs.createWriteStream(filePath);
    ws.write(module.exports.result.toString());
    ws.on('finish', function () {
        console.log('write finished');
        process.exit(0);
    });

    ws.on('error', function (err) {
        console.log('write error - %s', err.message);
    });

    callback(ws);
};

function setDefRules() {
    console.log('this is setDefRules');
    module.exports.rules.push(module.exports.getRule('img:not([alt])', 0, 'more', 'There are ${count} <img> without alt attribute'));
    module.exports.rules.push(module.exports.getRule('title', 1, 'less', 'There are ${count} title without alt attribute'));
    module.exports.rules.push(module.exports.getRule("meta[name='description']", 1, 'less', 'There are ${count} meta[name=description] not exist'));
    module.exports.rules.push(module.exports.getRule("meta[name='keywords']", 1, 'less', 'There are ${count} meta[name=keywords] not exist'));
    module.exports.rules.push(module.exports.getRule("strong", 15, 'more', 'There are ${count} strong '));
    module.exports.rules.push(module.exports.getRule("H1", 1, 'more', 'There are ${count} H1 '));
};

function addRule(ruleStr, timess, judges, messages) {
    module.exports.rules.push(module.exports.getRule(ruleStr, timess, judges, messages));
};

function getRule(ruleStr, timess, judges, messages) {
    let ruleOb = {};
    ruleOb.rule = ruleStr;
    ruleOb.times = timess;
    ruleOb.judge = judges;
    ruleOb.message = messages;
    return ruleOb;
};

function scanFromFile(filePath) {
    console.log('file path is ' + filePath);
    fs.readFile(filePath, function (err, data) {
        let setBody = module.exports.setHtmlBody(data.toString());
    });
};

function scanFromString(body) {
    let setBody = module.exports.setHtmlBody(body);
    // module.exports.htmlBody = body;
    // module.exports.runRules(module.exports.htmlBody);
};

function runRules(callback) {
    let content = cheerio.load(module.exports.htmlBody);
    module.exports.rules.forEach(element => {
        let count = content(element.rule).length;

        if (element.judge == 'less' && count < element.times) {
            let text = element.message.replace('${count}', count);
            module.exports.result.push(text);
        }

        if (element.judge == 'more' && count > element.times) {
            let text = element.message.replace('${count}', count);
            module.exports.result.push(text);
        }

    });

    callback();
};

function scanFromUrl(url, methodTypes) {
    console.log('this is scanFromUrl');
    request({
        uri: url,
        method: methodTypes
    }, function (error, response, body) {
        module.exports.setHtmlBody(body);
        //  module.exports.runRules();
    });
};

function getStreamFromFile(input, callback) {
    var remaining = '';

    input.on('data', function (data) {
        remaining += data;
        var index = remaining.indexOf('\n');
        var last = 0;
        while (index > -1) {
            var line = remaining.substring(last, index);
            last = index + 1;
            callback(line);
            index = remaining.indexOf('\n', last);
        }

        remaining = remaining.substring(last);
    });

    input.on('end', function () {
        if (remaining.length > 0) {
            callback(remaining);
        }
    });
};

function clearResult() {
    module.exports.result = [];
};


module.exports.setHtmlBody = setHtmlBody;
module.exports.setHtmlBodyByFile = setHtmlBodyByFile;
module.exports.setHtmlBodyByStream = setHtmlBodyByStream;
module.exports.printResultByConsole = printResultByConsole;
module.exports.setDefRules = setDefRules;
module.exports.addRule = addRule;
module.exports.getRule = getRule;
module.exports.scanFromFile = scanFromFile;
module.exports.scanFromString = scanFromString;
module.exports.runRules = runRules;
module.exports.scanFromUrl = scanFromUrl;
module.exports.printResultByFile = printResultByFile;
module.exports.getStreamFromFile = getStreamFromFile;
module.exports.clearResult = clearResult;
module.exports.printResultByWriteableStream = printResultByWriteableStream;