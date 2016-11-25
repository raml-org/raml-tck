var args = process.argv;
var fs = require("fs");
var path = require("path");

var processFolder;

if(args.length > 2 ) {
  processFolder = args[2];
} else {
  processFolder = "tests";
}

if(!fs.existsSync(processFolder)) {
  console.error("'" + processFolder + "' not found");
  return;
}

if (!fs.lstatSync(processFolder).isDirectory()) {
  console.error("'" + processFolder + "' is not a directory");
  return;
}

require("./generate")(processFolder);
