var fs = require("fs");
var parser = require("raml-1-parser");
var path = require("path");
var _ = require("underscore");

exports.prepareTests = prepareTests;
function prepareTests(dirContent) {
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
            var lastOverlayOrExtension = ordered[ordered.length - 1];
            result = [new Test(lastOverlayOrExtension.absolutePath(), null, defaultJSONPath(ordered[0].extends()))];
        }
    }
    return result;
}

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

exports.iterateFolders = iterateFolders;

function iterateFolders(folderAbsPath, result) {
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
        iterateFolders(childAbsPath, result);
    }
  }
  return result;
}

function extractContent(folderAbsPath) {
  if (!fs.lstatSync(folderAbsPath).isDirectory()) {
    return null;
  }
  var ramlFileNames = fs.readdirSync(folderAbsPath).filter(function (x) {
    return path.extname(x).toLowerCase() == ".raml"; }
  );
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

function extractMasterRef(filePath) {
  var raml = parser.loadRAMLSync(filePath, null);
  var extendsStr = raml.highLevel().attrValue("extends");

  if (!extendsStr) {
    return null;
  }

  var result = path.resolve(path.dirname(filePath), extendsStr);

  return result;
}

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

exports.defaultJSONPath = defaultJSONPath;
function defaultJSONPath(apiPath) {
    var dir = path.dirname(apiPath);
    var fileName = path.basename(apiPath).replace(".raml", "-tck.json");
    var str = path.resolve(dir, fileName);
    return str;
}

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
