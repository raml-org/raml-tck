"use strict";
/// <reference path="../../../../typings/main.d.ts" />
var fs = require("fs");
var path = require("path");
var index = require('raml-1-parser');
// var testUtil = require("../test-utils");
// var util = require("../../../util/index");
var mappings = require("./messageMappings");
var _ = require("underscore");
//var assert = require("assert");
var MessageMapping = (function () {
    function MessageMapping(patterns) {
        this.regExps = patterns.map(function (x) { return new RegExp(x); });
    }
    MessageMapping.prototype.match = function (a, b) {
        var aMatch = this.getValues(a);
        if (aMatch == null) {
            return null;
        }
        var bMatch = this.getValues(b);
        if (bMatch == null) {
            return null;
        }
        if (aMatch.length != bMatch.length) {
            return false;
        }
        for (var i = 1; i < aMatch.length; i++) {
            if (aMatch[i] != bMatch[i]) {
                return false;
            }
        }
        return true;
    };
    MessageMapping.prototype.getValues = function (str) {
        for (var _i = 0, _a = this.regExps; _i < _a.length; _i++) {
            var re = _a[_i];
            var match = str.match(re);
            if (match != null) {
                return match;
            }
        }
        return null;
    };
    return MessageMapping;
}());
var TestResult = (function () {
    function TestResult(apiPath, json, success, tckJsonPath) {
        this.apiPath = apiPath;
        this.json = json;
        this.success = success;
        this.tckJsonPath = tckJsonPath;
    }
    return TestResult;
}());
exports.TestResult = TestResult;
var messageMappings = mappings.map(function (x) {
    return new MessageMapping(x.messagePatterns.map(function (x) { return x.pattern; }));
});
function launchTests(folderAbsPath, reportPath, regenerateJSON, callTests) {
    var count = 0;
    var passed = 0;
    var report = [];
    var dirs = iterateFolder(folderAbsPath);
    for (var _i = 0, dirs_1 = dirs; _i < dirs_1.length; _i++) {
        var dir = dirs_1[_i];
        var tests = getTests(dir);
        for (var _a = 0, tests_1 = tests; _a < tests_1.length; _a++) {
            var test = tests_1[_a];
            count++;
            var result = testAPI(test.masterPath(), test.extensionsAndOverlays(), test.jsonPath(), regenerateJSON, callTests, false);
            if(!result){
                continue;
            }
            if (result.success) {
                passed++;
                console.log('js parser passed: ' + result.apiPath);
            }
            else {
                console.warn('js parser failed: ' + result.apiPath);
            }
            var reportItem = {
                apiPath: result.apiPath,
                errors: [],
                tckJsonPath: result.tckJsonPath,
                passed: result.success
            };
            if (result.json.errors) {
                for (var _b = 0, _c = result.json.errors; _b < _c.length; _b++) {
                    var err = _c[_b];
                    reportItem.errors.push(err.message + " in '" + err.path + "'.");
                }
            }
            report.push(reportItem);
        }
    }
    if(callTests) {
        console.log("total tests count: " + count);
        console.log("tests passed: " + passed);
        console.log("report file: " + reportPath);
        if (report) {
            fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        }
    }
}
exports.launchTests = launchTests;
function iterateFolder(folderAbsPath, result) {
    if (result === void 0) { result = []; }
    if (!fs.lstatSync(folderAbsPath).isDirectory()) {
        return;
    }
    var dirContent = extractContent(folderAbsPath);
    if (dirContent != null) {
        result.push(dirContent);
        return result;
    }
    for (var _i = 0, _a = fs.readdirSync(folderAbsPath); _i < _a.length; _i++) {
        var ch = _a[_i];
        var childAbsPath = path.resolve(folderAbsPath, ch);
        if (fs.lstatSync(childAbsPath).isDirectory()) {
            iterateFolder(childAbsPath, result);
        }
    }
    return result;
}
exports.iterateFolder = iterateFolder;
function extractContent(folderAbsPath) {
    if (!fs.lstatSync(folderAbsPath).isDirectory()) {
        return null;
    }
    var ramlFileNames = fs.readdirSync(folderAbsPath).filter(function (x) { return path.extname(x).toLowerCase() == ".raml"; });
    if (ramlFileNames.length == 0) {
        return null;
    }
    var ramlFilesAbsPaths = ramlFileNames.map(function (x) { return path.resolve(folderAbsPath, x); });
    var ramlFiles = [];
    for (var _i = 0, ramlFilesAbsPaths_1 = ramlFilesAbsPaths; _i < ramlFilesAbsPaths_1.length; _i++) {
        var f = ramlFilesAbsPaths_1[_i];
        var content = fs.readFileSync(f).toString();
        var ramlFirstLine = content.match(/^\s*#%RAML\s+(\d\.\d)\s*(\w*)\s*$/m);
        if (!ramlFirstLine || ramlFirstLine.length < 2) {
            continue;
        }
        var verStr = ramlFirstLine[1];
        var version = (verStr == "0.8") ? "RAML08" : "RAML10";
        var ramlFileType = "API";
        if (ramlFirstLine.length > 2 && ramlFirstLine[2].trim().length > 0) {
            ramlFileType = ramlFirstLine[2].toUpperCase();
        }
        var kind = RamlFileKind[ramlFileType];
        if (kind == null) {
            kind = RamlFileKind.FRAGMENT;
        }
        var extendsPath = null;
        if (kind == RamlFileKind.EXTENSION || kind == RamlFileKind.OVERLAY) {
            extendsPath = extractMasterRef(f);
        }
        var ramlFile = new RamlFile(f, kind, version, extendsPath);
        ramlFiles.push(ramlFile);
    }
    if (ramlFiles.length == 0) {
        return null;
    }
    return new DirectoryContent(folderAbsPath, ramlFiles);
}
exports.extractContent = extractContent;
function extractMasterRef(filePath) {
    var raml = index.loadRAMLSync(filePath, null);
    var extendsStr = raml.highLevel().attrValue("extends");
    if (!extendsStr) {
        return null;
    }
    var result = path.resolve(path.dirname(filePath), extendsStr);
    return result;
}
function getTests(dirContent) {
    var result = [];
    if (dirContent.hasCleanAPIsOnly()) {
        result = dirContent.masterAPIs().map(function (x) { return new Test(x.absolutePath()); });
    }
    else if (dirContent.hasSingleExtensionOrOverlay()) {
        result = dirContent.extnsionsAndOverlays().map(function (x) {
            var jsonPath = defaultJSONPath(x.extends());
            return new Test(x.absolutePath(), null, jsonPath);
        });
    }
    else if (dirContent.hasLibraries() && dirContent.masterAPIs().length == 0) {
        result = dirContent.libraries().map(function (x) { return new Test(x.absolutePath()); });
    }
    else if (dirContent.hasFragmentsOnly()) {
        result = dirContent.fragments().map(function (x) { return new Test(x.absolutePath()); });
    }
    else if (dirContent.hasExtensionsOrOverlaysAppliedToSingleAPI()) {
        var ordered = orderExtensionsAndOverlays(dirContent.extnsionsAndOverlays());
        if (ordered) {
            var apiPath = ordered[0].extends();
            var extensionsAndOverlays = ordered.map(function (x) { return x.absolutePath(); });
            result = [new Test(apiPath, extensionsAndOverlays)];
        }
    }
    return result;
}
exports.getTests = getTests;
var Test = (function () {
    function Test(_masterPath, _extensionsAndOverlays, _jsonPath) {
        this._masterPath = _masterPath;
        this._extensionsAndOverlays = _extensionsAndOverlays;
        this._jsonPath = _jsonPath;
    }
    Test.prototype.masterPath = function () { return this._masterPath; };
    Test.prototype.extensionsAndOverlays = function () { return this._extensionsAndOverlays; };
    Test.prototype.jsonPath = function () { return this._jsonPath; };
    return Test;
}());
exports.Test = Test;
(function (RamlFileKind) {
    RamlFileKind[RamlFileKind["API"] = 0] = "API";
    RamlFileKind[RamlFileKind["LIBRARY"] = 1] = "LIBRARY";
    RamlFileKind[RamlFileKind["EXTENSION"] = 2] = "EXTENSION";
    RamlFileKind[RamlFileKind["OVERLAY"] = 3] = "OVERLAY";
    RamlFileKind[RamlFileKind["FRAGMENT"] = 4] = "FRAGMENT";
})(exports.RamlFileKind || (exports.RamlFileKind = {}));
var RamlFileKind = exports.RamlFileKind;
var RamlFile = (function () {
    function RamlFile(_absPath, _kind, _ver, _extends) {
        this._absPath = _absPath;
        this._kind = _kind;
        this._ver = _ver;
        this._extends = _extends;
    }
    RamlFile.prototype.absolutePath = function () {
        return this._absPath.replace(/\\/g, '/');
        ;
    };
    RamlFile.prototype.kind = function () {
        return this._kind;
    };
    RamlFile.prototype.version = function () {
        return this._ver;
    };
    RamlFile.prototype.extends = function () {
        return this._extends;
    };
    return RamlFile;
}());
exports.RamlFile = RamlFile;
var DirectoryContent = (function () {
    function DirectoryContent(dirAbsPath, files) {
        this.dirAbsPath = dirAbsPath;
        this.files = files;
    }
    DirectoryContent.prototype.absolutePath = function () {
        return this.dirAbsPath.replace(/\\/g, '/');
    };
    DirectoryContent.prototype.allRamlFiles = function () {
        return this.files;
    };
    DirectoryContent.prototype.extnsionsAndOverlays = function () {
        return this.files.filter(function (x) { return x.kind() == RamlFileKind.EXTENSION || x.kind() == RamlFileKind.OVERLAY; });
    };
    DirectoryContent.prototype.masterAPIs = function () {
        return this.files.filter(function (x) { return x.kind() == RamlFileKind.API; });
    };
    DirectoryContent.prototype.fragments = function () {
        return this.files.filter(function (x) { return x.kind() == RamlFileKind.FRAGMENT; });
    };
    DirectoryContent.prototype.libraries = function () {
        return this.files.filter(function (x) { return x.kind() == RamlFileKind.LIBRARY; });
    };
    DirectoryContent.prototype.hasCleanAPIsOnly = function () {
        return this.extnsionsAndOverlays().length == 0 && this.masterAPIs().length > 0;
    };
    DirectoryContent.prototype.hasSingleExtensionOrOverlay = function () {
        return this.extnsionsAndOverlays().length == 1 && this.masterAPIs().length > 0;
    };
    DirectoryContent.prototype.hasExtensionsOrOverlaysAppliedToSingleAPI = function () {
        return this.extnsionsAndOverlays().length > 0 && this.masterAPIs().length == 1;
    };
    DirectoryContent.prototype.hasFragmentsOnly = function () {
        return this.fragments().length == this.files.length;
    };
    DirectoryContent.prototype.hasLibraries = function () {
        return this.libraries().length > 0;
    };
    return DirectoryContent;
}());
exports.DirectoryContent = DirectoryContent;
function defaultJSONPath(apiPath) {
    var dir = path.dirname(apiPath);
    var fileName = path.basename(apiPath).replace(".raml", "-tck.json");
    var str = path.resolve(dir, fileName);
    return str;
}
exports.defaultJSONPath = defaultJSONPath;
;
function orderExtensionsAndOverlays(ramlFiles) {
    var indToFileMap = {};
    var pathToIndMap = {};
    for (var _i = 0, ramlFiles_1 = ramlFiles; _i < ramlFiles_1.length; _i++) {
        var rf = ramlFiles_1[_i];
        var fPath = rf.absolutePath();
        var fName = path.basename(fPath);
        var indStr = fName.replace(/([a-zA-Z]*)(\d*)(\.raml)/, "$2");
        indStr = indStr == "" ? "0" : "" + parseInt(indStr);
        var ind = parseInt(indStr);
        if (indToFileMap[indStr]) {
            return null;
        }
        indToFileMap[indStr] = rf;
        pathToIndMap[rf.absolutePath()] = ind;
    }
    var sorted = _.sortBy(ramlFiles, function (x) {
        return pathToIndMap[x.absolutePath()];
    });
    return sorted;
}
function testAPI(apiPath, extensions, tckJsonPath, regenerteJSON, callTests, doAssert) {
    if (regenerteJSON === void 0) { regenerteJSON = false; }
    if (callTests === void 0) { callTests = true; }
    // if (apiPath) {
    //     apiPath = testUtil.data(apiPath);
    // }
    // if (extensions) {
    //     extensions = extensions.map(function (x) { return testUtil.data(x); });
    // }
    if (!tckJsonPath) {
        tckJsonPath = defaultJSONPath(apiPath);
    }
    // else {
    //     tckJsonPath = testUtil.data(tckJsonPath);
    // }
    var api = index.loadRAMLSync(apiPath, extensions);
    var expanded = api["expand"] ? api["expand"]() : api;
    expanded.setAttributeDefaults(true);
    var json = expanded.toJSON({ rootNodeDetails: true });
    if (!tckJsonPath) {
        tckJsonPath = defaultJSONPath(apiPath);
    }
    if (regenerteJSON) {
        fs.writeFileSync(tckJsonPath, JSON.stringify(json, null, 2));
    }
    if (!fs.existsSync(tckJsonPath)) {
        fs.writeFileSync(tckJsonPath, JSON.stringify(json, null, 2));
        if (!callTests) {
            console.log("TCK JSON GENERATED: " + tckJsonPath);
            return;
        }
        console.warn("FAILED TO FIND TCK JSON: " + tckJsonPath);
    }
    if (!callTests) {
        return;
    }
    var tckJson = JSON.parse(fs.readFileSync(tckJsonPath).toString());
    var pathRegExp = new RegExp('/errors\\[\\d+\\]/path');
    var messageRegExp = new RegExp('/errors\\[\\d+\\]/message');
    var diff = /*testUtil.*/compare(json, tckJson).filter(function (x) {
        if (x.path.match(pathRegExp)) {
            return false;
        }
        if (x.path.match(messageRegExp)) {
            for (var _i = 0, messageMappings_1 = messageMappings; _i < messageMappings_1.length; _i++) {
                var mm = messageMappings_1[_i];
                if (mm.match(x.value0, x.value1)) {
                    return false;
                }
            }
        }
        return true;
    });
    var success = false;
    if (diff.length == 0) {
        success = true;
    }
    else {
        console.warn("DIFFERENCE DETECTED FOR " + tckJsonPath);
        console.warn(diff.map(function (x) { return x.message("actual", "expected"); }).join("\n\n"));
        if (doAssert) {
            //assert(false);
        }
    }
    return new TestResult(apiPath, tckJson, success, tckJsonPath);
}
exports.testAPI = testAPI;
function generateMochaSuite(folderAbsPath, dstPath, dataRoot) {
    var dirs = iterateFolder(folderAbsPath);
    var map = {};
    for (var _i = 0, dirs_2 = dirs; _i < dirs_2.length; _i++) {
        var dir = dirs_2[_i];
        var tests = getTests(dir);
        if (tests.length > 0) {
            var suiteFolder = path.resolve(dir.absolutePath(), "../").replace(/\\/g, '/');
            var arr = map[suiteFolder];
            if (!arr) {
                arr = [];
                map[suiteFolder] = arr;
            }
            for (var _a = 0, tests_2 = tests; _a < tests_2.length; _a++) {
                var t = tests_2[_a];
                arr.push(t);
            }
        }
    }
    var suitePaths = Object.keys(map).sort();
    var suiteStrings = [];
    for (var _b = 0, suitePaths_1 = suitePaths; _b < suitePaths_1.length; _b++) {
        var suitePath = suitePaths_1[_b];
        var title = suiteTitle(suitePath);
        if (!title) {
            continue;
        }
        var suiteStr = dumpSuite(title, dataRoot, map[suitePath]);
        suiteStrings.push(suiteStr);
    }
    var content = fileContent(suiteStrings, dstPath);
    fs.writeFileSync(dstPath, content);
}
exports.generateMochaSuite = generateMochaSuite;
function suiteTitle(absPath) {
    var ind = Math.max(absPath.indexOf("RAML10"), absPath.indexOf("RAML08"));
    if (ind < 0) {
        return null;
    }
    return absPath.substring(ind);
}
function dumpSuite(title, dataRoot, tests) {
    var dumpedTests = tests.map(function (x) { return dumpTest(x, dataRoot); });
    var testsStr = dumpedTests.join("\n\n");
    return "describe('" + title + "',function(){\n    \n" + testsStr + "\n    \n});";
}
function dumpTest(test, dataRoot) {
    var relMasterPath = path.relative(dataRoot, test.masterPath()).replace(/\\/g, '/');
    ;
    var args = [("\"" + relMasterPath + "\"")];
    if (test.extensionsAndOverlays()) {
        var relArr = test.extensionsAndOverlays().map(function (x) { return path.relative(dataRoot, x).replace(/\\/g, '/'); });
        if (relArr.length > 0) {
            args.push("[ " + relArr.map(function (x) { return ("\"" + x + "\""); }).join(", ") + " ]");
        }
    }
    var jsonPath = test.jsonPath() ? path.relative(dataRoot, test.jsonPath()).replace(/\\/g, '/') : null;
    if (jsonPath != null) {
        if (!test.extensionsAndOverlays()) {
            args.push("null");
        }
        args.push("\"" + jsonPath + "\"");
    }
    return "    it(\"" + path.basename(path.dirname(test.masterPath())) + "/" + path.basename(test.masterPath()) + "\", function () {\n        this.timeout(15000);\n        tckUtil.testAPI(" + args.join(", ") + ");\n    });";
}
var toIncludePath = function (workingFolder, absPath) {
    var relPath = path.relative(workingFolder, absPath).replace(/\\/g, "/");
    if (!relPath || relPath.charAt(0)!=".") {
        relPath = "./" + relPath;
    }
    return relPath;
};
function projectFolder() {
    var folder = __dirname;
    while (!fs.existsSync(path.resolve(folder, "package.json"))) {
        folder = path.resolve(folder, "../");
    }
    return folder;
}
exports.projectFolder = projectFolder;
;
function fileContent(suiteStrings, filePath) {
    var folder = projectFolder();
    var dstFolder = path.dirname(filePath);
    var tckUtilPath = path.resolve(folder, "./src/raml1/test/scripts/tckUtil");
    var typingsPath = path.resolve(folder, "typings/main.d.ts");
    var relTckUtilPath = toIncludePath(dstFolder, tckUtilPath);
    var relTypingsPath = toIncludePath(dstFolder, typingsPath);
    return "/**\n * ATTENTION !!! The file is generated. Manual changes will be overridden by the nearest build.\n */\n/// <reference path=\"" + relTypingsPath + "\" />\nimport tckUtil = require(\"" + relTckUtilPath + "\")\n\ndescribe('Complete TCK Test Set',function(){\n\n" + suiteStrings.join("\n\n") + "\n\n});\n\n";
}
;
function compare(arg0, arg1, path) {
    if (path === void 0) { path = ''; }
    var diffs = [];
    if (arg0 == null) {
        if (arg1 != null) {
            diffs.push(new Diff(path, arg0, arg1, 'Defined/undefined mismatch'));
            return diffs;
        }
    }
    else if (arg1 == null) {
        diffs.push(new Diff(path, arg0, arg1, 'Defined/undefined mismatch'));
        return diffs;
    }
    else if (Array.isArray(arg0)) {
        if (!Array.isArray(arg1)) {
            diffs.push(new Diff(path, arg0, arg1, 'Array/' + typeof (arg1) + ' mismatch'));
            return diffs;
        }
        else {
            var l0 = arg0.length;
            var l1 = arg1.length;
            if (l1 != l0) {
                diffs.push(new Diff(path, arg0, arg1, 'Array lengths mismatch'));
                return diffs;
            }
            var l = Math.min(l0, l1);
            for (var i = 0; i < l; i++) {
                diffs = diffs.concat(compare(arg0[i], arg1[i], path + '[' + i + ']'));
            }
        }
    }
    else if (arg0 instanceof Object) {
        if (!(arg1 instanceof Object)) {
            diffs.push(new Diff(path, arg0, arg1, 'Object/' + typeof (arg1) + ' mismatch'));
            return diffs;
        }
        else {
            var keys0 = Object.keys(arg0);
            var keys1 = Object.keys(arg1);
            var map = {};
            for (var i = 0; i < keys0.length; i++) {
                var key = keys0[i];
                map[key] = true;
                var val0 = arg0[key];
                var val1 = arg1[key];
                diffs = diffs.concat(compare(val0, val1, path + '/' + key));
            }
            for (var i = 0; i < keys1.length; i++) {
                var key = keys1[i];
                if (map[key]) {
                    continue;
                }
                var val0 = arg0[key];
                var val1 = arg1[key];
                diffs = diffs.concat(compare(val0, val1, path + '/' + key));
            }
        }
    }
    else {
        if (arg0 !== arg1) {
            diffs.push(new Diff(path, arg0, arg1, 'Inequal values'));
        }
    }
    return diffs;
}
exports.compare = compare;
var Diff = (function () {
    function Diff(path, value0, value1, comment) {
        this.path = path;
        this.value0 = value0;
        this.value1 = value1;
        this.comment = comment;
    }
    Diff.prototype.message = function (label0, label1) {
        label0 = label0 || "value0";
        label1 = label1 || "value1";
        var strValue0 = "undefined";
        var strValue1 = "undefined";
        if (this.value0 != null) {
            try {
                strValue0 = JSON.stringify(this.value0, null, 2).trim();
            }
            catch (err) {
                strValue0 = this.value0.toString();
            }
        }
        if (this.value1 != null) {
            try {
                strValue1 = JSON.stringify(this.value1, null, 2).trim();
            }
            catch (err) {
                strValue1 = this.value1.toString();
            }
        }
        return "path: " + this.path + "\ncomment: " + this.comment + "\n" + label0 + ": " + strValue0 + "\n" + label1 + ": " + strValue1;
    };
    return Diff;
}());
exports.Diff = Diff;