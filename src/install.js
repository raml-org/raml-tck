var fs = require('fs');
var path = require('path');

var spawnSync = require('child_process').spawnSync;

var root = path.resolve(__dirname, '../generated');

var isWin = /^win/.test(process.platform);

var testsCount = 0;
var jsTestsCountPassed = 0;

function install() {
    copySources();

    cloneJavaParser();

    npmInstall();

    mvnInstall();

    setupJavaTestProject();

    console.log('running js parser tests...');

    runJsTests();

    console.log('running java parser tests...');

    runJavaTests();
}

function runJavaTests() {
    var jsJsonPath = path.resolve(root, './parsers/jsparser/result.json');

    runApiJava(jsJsonPath);
}

function printDiff(jsErrors, javaErrors) {
    console.log('expected:' + (jsErrors.length === 0 ? ' no errors.\n' : '\n'));

    if(jsErrors.length > 0) {
        printErrors(jsErrors);
    }

    console.log('actually:' + (javaErrors.length === 0 ? ' no errors.\n' : '\n'));

    if(javaErrors.length > 0) {
        printErrors(javaErrors);
    }
}

function printErrors(errors) {
    errors.forEach(function(error) {
        console.log('\t' + error);
    });
}

function runJsTests() {
    var tests = path.resolve(root, './parsers/jsparser/tckGenerator.js');
    
    var contents = path.resolve(__dirname, './source/TCK');

    var spawned = spawnSync('node', [tests, '-path', contents], {stdio: [0, 1, 2]});

    if(spawned.error) {
        throw new Error(error);
    }
}

function npmInstall() {
    var destination = path.resolve(root, './parsers/jsparser');

    var command = 'npm';
    
    if(isWin){
        command += ".cmd";
    }
    
    var installResult = spawnSync(command, ['install', '--prefix', destination], {stdio: [0, 1, 2]});
}

function copySources() {
    var packageJsonPath = path.resolve(root, './parsers/jsparser/package.json');
    
    if(fs.existsSync(root)) {
        deleteFolderRecursive(root);
    }

    fs.mkdirSync(root);

    //copyFolderRecursiveSync(path.resolve(__dirname, './source/TCK'), root);
    copyFolderRecursiveSync(path.resolve(__dirname, './source/parsers'), root);

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson,null,2));
}

function copyFileSync(source, target) {
    var targetFile = target;
    
    if(fs.existsSync(target)) {
        if(fs.lstatSync(target).isDirectory()) {
            targetFile = path.join(target, path.basename(source));
        }
    }
    
    fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function copyFolderRecursiveSync(source, target) {
    var files = [];
    
    var targetFolder = path.join(target, path.basename(source));
    
    if(!fs.existsSync(targetFolder)) {
        fs.mkdirSync(targetFolder);
    }
    
    if(fs.lstatSync(source).isDirectory() ) {
        files = fs.readdirSync(source);
        
        files.forEach(function(file) {
            var curSource = path.join(source, file);
            
            if(fs.lstatSync(curSource).isDirectory()) {
                copyFolderRecursiveSync(curSource, targetFolder);
            } else {
                copyFileSync(curSource, targetFolder);
            }
        });
    }
}

function deleteFolderRecursive(path) {
    if(fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function(file, index){
            var curPath = path + "/" + file;

            if(fs.lstatSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });

        fs.rmdirSync(path);
    }
}

var packageJson = {
    "name": "tck-tests",
    "version": "0.0.0",
    "private": true,
    "scripts": {
        "start": "node ./run"
    },

    "dependencies": {
        // "istanbul": "^0.4.2",
        // "mocha": "^2.2.1",
        "raml-1-parser": "^0.2.12",
        "underscore": "^1.8.3"
    }
}

function cloneJavaParser() {
    var javaRepoPath = path.resolve(root, './parsers/javaparser/rajapa');

    if(!fs.existsSync(javaRepoPath)) {
        fs.mkdirSync(javaRepoPath);
    }
    
    spawnSync('git', ['clone', 'https://github.com/mulesoft-labs/rajapa.git', javaRepoPath], {stdio: [0, 1, 2]});
}

function mvnInstall() {
    var pomXmlPath = path.resolve(root, './parsers/javaparser/rajapa/pom.xml');
    
    var command = 'mvn';
    
    if(isWin){
        command += ".bat";

        pomXmlPath = pomXmlPath.replace(/\\/g,"/");
    }
    var res = spawnSync(command, ['clean', '-f', pomXmlPath, 'package', '-P', 'jar-with-dependencies'], {stdio: [0, 1, 2]});
}

function setupJavaTestProject() {
    var targetDir = path.resolve(root, './parsers/javaparser/rajapa/target');
    
    var testLibTargetDir = path.resolve(root, './parsers/javaparser/rajapatest/lib/raml-parser.jar');

    var dependencyPath = path.resolve(root, './parsers/javaparser/rajapatest/lib/json-simple.jar');

    var mainJava = path.resolve(root, './parsers/javaparser/rajapatest/src/rajapatest/Main.java');
    
    var targetName = null;
    
    fs.readdirSync(targetDir).forEach(function(filename) {
        if(/raml-parser(.)*SNAPSHOT.jar/.test(filename)) {
            targetName = filename;
        }
    });

    if(targetName==null){
        console.warn("Java parser build failed");
        return;
    }
    
    fs.writeFileSync(testLibTargetDir, fs.readFileSync(targetDir + '/' + targetName));

    var jarOutputDir = path.resolve(root, './parsers/javaparser/rajapatest/output');

    if(!fs.existsSync(jarOutputDir)) {
        fs.mkdir(jarOutputDir);
    }

    var delim = path.delimiter;

    spawnSync('javac', ['-cp', "" + testLibTargetDir + delim + dependencyPath + "", '-d', jarOutputDir, mainJava], {stdio: [0, 1, 2]});
}

function runApiJava(ramlPath) {
    var targetDir = path.resolve(root, './parsers/javaparser/rajapa/target');

    var testLibTargetDir = path.resolve(root, './parsers/javaparser/rajapatest/lib/raml-parser.jar');
    if(!fs.existsSync(testLibTargetDir)){
        console.warn("Unable to run Java parser tests because Java parser build has failed.");
        return;
    }

    var dependencyPath = path.resolve(root, './parsers/javaparser/rajapatest/lib/json-simple.jar');

    var mainJava = path.resolve(root, './parsers/javaparser/rajapatest/src/rajapatest/Main.java');

    var jarOutputDir = path.resolve(root, './parsers/javaparser/rajapatest/output');
    var delim = path.delimiter;
    var spawned = spawnSync('java', ['-cp', testLibTargetDir + delim + dependencyPath + delim + jarOutputDir, 'rajapatest.Main', ramlPath], {stdio: [0, 1, 2]});
}

install();