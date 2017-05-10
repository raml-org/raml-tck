'use strict';

var path = require('path')
var raml1Parser = require("raml-1-parser")
var fs = require("fs")
var glob = require("glob")
var handlebars = require("handlebars")

handlebars.registerHelper('if_eq', function(a, b, opts) {
  if (a == b) {
      return opts.fn(this);
  } else {
      return opts.inverse(this);
  }
});

handlebars.registerHelper('replace', function(str, a, b, opts) {
  return str.replace(new RegExp(a, "g"), b);
});

readConfig()
.then((testReports) => {
  var numberOfTestsFailed = 0;
  var totalNumberOfTests = 0;
  
  testReports.forEach(testReport => {
    numberOfTestsFailed += testReport.results.reduce(function(acc, val) {
      if(val.testFailed) {
        acc++;
      }

      return acc;
    },0)
  });

  testReports.forEach(testReport => {
    totalNumberOfTests += testReport.results.reduce(function(acc, val) {
      acc++;
      return acc;
    },0)
  });
  
  var fullreport = {
    numberOfTestsFailed: numberOfTestsFailed,
    testReports: testReports,
    totalNumberOfTests: totalNumberOfTests
  };

  generateReport(fullreport);
})
.catch((e) => console.log(e));

function generateReport(report) {
  return new Promise((resolve) => {
    fs.readFile('test_result_form.hbs', 'utf-8', function(error, source) {
      var template = handlebars.compile(source);
      var html = template(report);

      fs.writeFile("report.html", html, function(err) {
        if(err) {
          return console.log(err);
        }
        resolve();
      });
    });
  });
}

function readConfig() {
  return new Promise((resolve, reject) => {
    var promises = [];
    glob("../../tests/**/test-config.json", function (err, files) {
      files.forEach(file => {
        var testDir = path.dirname(file);
        promises.push(executeTests(file, testDir));
      });
      Promise.all(promises)
      .then((report) => resolve(report));
    });
  });
}

function executeTests(file, testDir) {
  return new Promise((resolve) => {
    fs.readFile(file, 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
    
      var testconfig = JSON.parse(data)

      let report = {
        section: testconfig.section,
        ramlversion: testconfig.ramlversion
      }
      let results = [];
      testconfig.tests.forEach(test => {
        var ramlPath = testDir + "/" + test.input

        var isValid = isValidRAML(ramlPath)
        //console.log("test '" + test.description + "'; result: '" + (test.valid != isValid) + "'");

        var testResult = {
          description: test.description,
          expected: test.valid,
          actual: isValid,
          testFailed: (test.valid != isValid)
        }
        results.push(testResult)
      });

      report.results = results;
      resolve(report);
    });
  });
}

function isValidRAML(ramlPath) {
  console.log(ramlPath);
  //initial loading
  var syncParseResult = raml1Parser.loadApiSync(path.resolve(__dirname, ramlPath), {
      rejectOnErrors: false
  });

  //expansion when possible (with fragments no expansion is necessary)
  var expandedResult = syncParseResult.expand ? syncParseResult.expand(true) : syncParseResult;

  //conversion to JSON
  var resultingJSON = expandedResult.toJSON({rootNodeDetails: true});

  //checking if there are errors
  var hasIssues = resultingJSON.errors.length != 0

  var isValid = true;

  if (hasIssues) {
    resultingJSON.errors.forEach(function(error) { 
      if(!error.isWarning) {
        isValid = false
      } 
    })
  }

  return isValid
}