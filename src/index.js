var args = process.argv;
var fs = require("fs");

var processFolder = args[2];

if(!fs.existsSync(processFolder)) {
  console.error("'" + processFolder + "' not found");
  return;
}

if (!fs.lstatSync(processFolder).isDirectory()) {
  console.error("'" + processFolder + "' is not a directory");
  return;
}

require("./generate")(processFolder);
