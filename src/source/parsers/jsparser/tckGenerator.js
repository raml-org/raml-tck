var fs = require("fs");
var path = require("path");
var index = require('raml-1-parser');
var _ = require("underscore");

var count = 0;

var skipGeneration = true;

var resultJson = {};

function iterateFolder(folderAbsPath) {
    if (!fs.lstatSync(folderAbsPath).isDirectory()) {
        return;
    }
    var dirContent = extractContent(folderAbsPath);
    if (dirContent != null) {
        processDirectory(dirContent);
        return;
    }
    for (var _i = 0, _a = fs.readdirSync(folderAbsPath); _i < _a.length; _i++) {
        var ch = _a[_i];
        var childAbsPath = path.resolve(folderAbsPath, ch);
        if (fs.lstatSync(childAbsPath).isDirectory()) {
            iterateFolder(childAbsPath);
        }
    }
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
function processDirectory(dirContent) {
    if (dirContent.hasCleanAPIsOnly()) {
        for (var _i = 0, _a = dirContent.masterAPIs(); _i < _a.length; _i++) {
            var rf = _a[_i];
            testAPI(rf.absolutePath());
        }
        return;
    }
    else if (dirContent.hasSingleExtensionOrOverlay()) {
        for (var _b = 0, _c = dirContent.extnsionsAndOverlays(); _b < _c.length; _b++) {
            var rf = _c[_b];
            var jsonPath = defaultJSONPath(rf.extends());
            testAPI(rf.absolutePath(), null, jsonPath);
        }
        return;
    }
    else if (dirContent.hasLibraries() && dirContent.masterAPIs().length == 0) {
        for (var _d = 0, _e = dirContent.libraries(); _d < _e.length; _d++) {
            var rf = _e[_d];
            testAPI(rf.absolutePath());
        }
        return;
    }
    else if (dirContent.hasFragmentsOnly()) {
        for (var _f = 0, _g = dirContent.fragments(); _f < _g.length; _f++) {
            var rf = _g[_f];
            testAPI(rf.absolutePath());
        }
        return;
    }
    else if (dirContent.hasExtensionsOrOverlaysAppliedToSingleAPI()) {
        var ordered = orderExtensionsAndOverlays(dirContent.extnsionsAndOverlays());
        if (ordered) {
            var apiPath = ordered[0].extends();
            var extensionsAndOverlays = ordered.map(function (x) { return x.absolutePath(); });
            testAPI(apiPath, extensionsAndOverlays);
            return;
        }
    }
    console.warn("UNABLE TO DETERMINE TEST CONFIGURATION: " + dirContent.absolutePath());
}
exports.processDirectory = processDirectory;
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
        return this._absPath;
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
        return this.dirAbsPath;
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
function testAPI(apiPath, extensions, tckJsonPath) {
    var api = index.loadRAMLSync(apiPath, extensions);
    var expanded = api["expand"] ? api["expand"]() : api;
    expanded.setAttributeDefaults(true);
    var json = expanded.toJSON({ rootNodeDetails: true });
    if (!tckJsonPath) {
        tckJsonPath = defaultJSONPath(apiPath);
    }
    if (!fs.existsSync(tckJsonPath)) {
        console.warn("FAILED TO FIND JSON: " + tckJsonPath);

        var jsonStr =  JSON.stringify(json, null, 2);

        fs.writeFileSync(tckJsonPath, jsonStr);
    }
    var tckJson = JSON.parse(fs.readFileSync(tckJsonPath).toString());

    var regExp = new RegExp('/errors\\[\\d+\\]/path');
    var diff = compare(json, tckJson).filter(function (x) { return !x.path.match(regExp); });
    if (diff.length == 0) {
    }
    else {
        console.warn("DIFFERENCE DETECTED FOR " + tckJsonPath);
        console.warn(diff.map(function (x) { return x.message("actual", "expected"); }).join("\n\n"));
    }
}
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
var args = process.argv;
var dirPath;
for (var i = 0; i < args.length; i++) {
    if (args[i] == "-path" && i < args.length - 1) {
        dirPath = args[i + 1];
    }
}
if (!path.isAbsolute(dirPath)) {
    dirPath = path.resolve(process.cwd(), dirPath);
}
iterateFolder(dirPath);
//# sourceMappingURL=tckGenerator.js.map
