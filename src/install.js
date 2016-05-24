var fs = require('fs');
var path = require('path');

var spawnSync = require('child_process').spawnSync;

var root = path.resolve(__dirname, '../generated');

var isWin = /^win/.test(process.platform);

function install() {
    copySources();

    npmInstall();

    runJsTests();

    // cloneJavaParser();
    //
    // mvnInstall();
    //
    // setupJavaTestProject();
    //
    // var json = runApiJava('/Users/dreamflyer/Downloads/project/modules/raml-js-parser-2/src/raml1/test/data/TCK/RAML10/Types/test1/apiValid.raml');
    //
    // console.log('result:');
    // console.log(JSON.stringify(json, null, '\t'));
}

function runJsTests() {
    // var istanbul = path.resolve(root, './parsers/jsparser/node_modules/.bin/istanbul');
    // var mocha = path.resolve(root, './parsers/jsparser/node_modules/.bin/_mocha');
    // var tests = path.resolve(root, './parsers/jsparser/tests');
    //
    // var istanbulResult = spawnSync(istanbul, ['cover', mocha, tests], {stdio: [0, 1, 2]});
    var tests = path.resolve(root, './parsers/jsparser/tckGenerator.js');
    var contents = path.resolve(root, './TCK');

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

    copyFolderRecursiveSync(path.resolve(__dirname, './source/TCK'), root);
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

    console.log('mvn install...');

    var res = spawnSync('mvn', ['clean', '-f', pomXmlPath, 'package', '-P', 'jar-with-dependencies'], {stdio: [0, 1, 2]});

    console.log('mvn install done.' + (res.error || res.errors));

    if(res.error || res.errors) {
        throw new Error(res.error || res.errors)
    }
}

function setupJavaTestProject() {
    var targetDir = path.resolve(root, './parsers/javaparser/rajapa/target');
    
    var testLibTargetDir = path.resolve(root, './parsers/javaparser/rajapatest/lib/raml-parser.jar');

    var dependencyPath = path.resolve(root, './parsers/javaparser/rajapatest/lib/json-simple.jar');

    var mainJava = path.resolve(root, './parsers/javaparser/rajapatest/src/rajapatest/Main.java');
    
    var targetName = ''; 
    
    fs.readdirSync(targetDir).forEach(function(filename) {
        if(/raml-parser(.)*SNAPSHOT.jar/.test(filename)) {
            targetName = filename;
        }
    });
    
    fs.writeFileSync(testLibTargetDir, fs.readFileSync(targetDir + '/' + targetName));

    var jarOutputDir = path.resolve(root, './parsers/javaparser/rajapatest/output');

    if(!fs.existsSync(jarOutputDir)) {
        fs.mkdir(jarOutputDir);
    }

    spawnSync('javac', ['-cp', "" + testLibTargetDir + ':' + dependencyPath + "", '-d', jarOutputDir, mainJava], {stdio: [0, 1, 2]});
}

function runApiJava(ramlPath) {
    var targetDir = path.resolve(root, './parsers/javaparser/rajapa/target');

    var testLibTargetDir = path.resolve(root, './parsers/javaparser/rajapatest/lib/raml-parser.jar');

    var dependencyPath = path.resolve(root, './parsers/javaparser/rajapatest/lib/json-simple.jar');

    var mainJava = path.resolve(root, './parsers/javaparser/rajapatest/src/rajapatest/Main.java');

    var jarOutputDir = path.resolve(root, './parsers/javaparser/rajapatest/output');
    var delim = path.delimiter;
    var spawned = spawnSync('java', ['-cp', testLibTargetDir + delim + dependencyPath + delim + jarOutputDir, 'rajapatest.Main', ramlPath]);

    return JSON.parse(spawned.output.join(''));
}

install();