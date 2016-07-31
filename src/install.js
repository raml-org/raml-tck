var fs = require('fs');
var path = require('path');

var spawnSync = require('child_process').spawnSync;

var root = path.resolve(__dirname, '../generated');

var isWin = /^win/.test(process.platform);

var testsCount = 0;
var jsTestsCountPassed = 0;

function runAll(){

    copySources();

    cloneJavaParser();

    npmInstall();

    console.log('generating TCK JSONs...');

    runJsTests(false);

    mvnInstall();

    setupJavaTestProject();

    console.log('running js parser tests...');

    runJsTests(true);

    console.log('running java parser tests...');

    runJavaTests();

}

function runGenerate(){
    copySources();

    npmInstall();

    console.log('generating TCK JSONs...');

    runJsTests(false);
}

function runTest() {

    copySources();

    cloneJavaParser();

    npmInstall();

    mvnInstall();

    setupJavaTestProject();

    console.log('running js parser tests...');

    runJsTests(true);

    console.log('running java parser tests...');

    runJavaTests();
}

function runJavaTests() {
    var jsJsonPath = path.resolve(root, './parsers/jsparser/report.json');

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

function runJsTests(callTests) {
    var scriptPath = path.resolve(root, './parsers/jsparser/tckLauncher.js');
    var reportPath = path.resolve(root, './parsers/jsparser/report.json');

    var tckDir = path.resolve(__dirname, './source/TCK');

    var args = [scriptPath, '-path', tckDir, '-report', reportPath];
    if(callTests===true){
        args.push('-callTests');
    }
    var spawned = spawnSync(
        'node',
        args,
        {stdio: [0, 1, 2]}
    );

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
    var javaRepoPath = path.resolve(root, './parsers/javaparser/raml-parser-parent');

    if(!fs.existsSync(javaRepoPath)) {
        fs.mkdirSync(javaRepoPath);
    }
    
    spawnSync('git', ['clone', '-b', 'v2', '--depth', '1', 'https://github.com/raml-org/raml-java-parser.git', javaRepoPath], {stdio: [0, 1, 2]});
}

function mvnInstall() {
    var pomXmlPath = path.resolve(root, './parsers/javaparser/raml-parser-parent/pom.xml');
    
    var command = 'mvn';
    
    if(isWin){
        command += ".bat";

        pomXmlPath = pomXmlPath.replace(/\\/g,"/");
    }
    var res = spawnSync(command, ['clean', '-f', pomXmlPath, 'package', '-P', 'jar-with-dependencies', '-Dmaven.test.skip=true', '-Dlicense.skip=true', '-Dformatter.skip=true'], {stdio: [0, 1, 2]});
}

function setupJavaTestProject() {
    var targetDir = path.resolve(root, './parsers/javaparser/raml-parser-parent/raml-parser-2/target');
    
    var testLibTargetDir = path.resolve(root, './parsers/javaparser/test-project/lib/raml-parser.jar');

    var dependencyPath = path.resolve(root, './parsers/javaparser/test-project/lib/json-simple.jar');

    var mainJava = path.resolve(root, './parsers/javaparser/test-project/src/org/raml/java/parser/tck/test/Main.java');
    
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

    var jarOutputDir = path.resolve(root, './parsers/javaparser/test-project/output');

    if(!fs.existsSync(jarOutputDir)) {
        fs.mkdir(jarOutputDir);
    }

    var delim = path.delimiter;

    spawnSync('javac', ['-cp', "" + testLibTargetDir + delim + dependencyPath + "", '-d', jarOutputDir, mainJava], {stdio: [0, 1, 2]});
}

function runApiJava(ramlPath) {
    var targetDir = path.resolve(root, './parsers/javaparser/raml-parser-parent/raml-parser-2/target');

    var testLibTargetDir = path.resolve(root, './parsers/javaparser/test-project/lib/raml-parser.jar');
    if(!fs.existsSync(testLibTargetDir)){
        console.warn("Unable to run Java parser tests because Java parser build has failed.");
        return;
    }

    var dependencyPath = path.resolve(root, './parsers/javaparser/test-project/lib/json-simple.jar');

    var mainJava = path.resolve(root, './parsers/javaparser/test-project/src/org/raml/java/parser/tck/test/Main.java');

    var jarOutputDir = path.resolve(root, './parsers/javaparser/test-project/output');
    var delim = path.delimiter;
    var spawned = spawnSync('java', ['-cp', testLibTargetDir + delim + dependencyPath + delim + jarOutputDir, 'org.raml.java.parser.tck.test.Main', ramlPath, __run08], {stdio: [0, 1, 2]});
}

var args = process.argv;
var __all = false;
var __test = false;
var __generate = false;
var __run08 = false;
for(var i = 0 ; i < args.length ; i++){

    if(args[i]=="-all"){
        _all = true;
        break;
    }
    else if(args[i]=="-test"){
        __test = true;
        break;
    }
    else if(args[i]=="-generate"){
        __generate = true;
        break;
    }
    else if(args[i]=="-run08"){
        __run08 = true;
    }
}
if(__all){
    runAll();
}
else if(__test){
    runTest();
}
else if(__generate){
    runGenerate();
}