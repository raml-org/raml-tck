const path = require('path')
const fs = require("fs")
const walk = require('walk')
const utils = require("./utils")

// TODO: Fill these
const FEATURES_PRIORITY = {
  methodresponses: 1,
  fragments: 2,
  libraries: 4
}

function main () {
  const fpath = getInputFolderPath()
  const dirs = utils.iterateFolders(fpath)
  let ramlPaths = extractRAMLPaths(dirs)
  ramlPaths = sortRAMLPaths(fpath, ramlPaths)
  generateManifest(fpath, ramlPaths)
}

// Extract string paths from utils.DirectoryContent objects
function extractRAMLPaths (dirObjs) {
  let ramlPaths = []
  dirObjs.forEach((obj) => {
    obj.allRamlFiles().forEach((ramlFileObj) => {
      ramlPaths.push(ramlFileObj.absolutePath())
    })
  })
  return ramlPaths
}

// Sort string ramlPaths according to features definition order
// in RAML 1.0 spec
function sortRAMLPaths (ramlsRoot, ramlPaths) {
  const pathObjs = extendWithPriority(ramlsRoot, ramlPaths)
  const sortedPathObjs = pathObjs.sort((obj1, obj2) => {
    return obj1.priority - obj2.priority
  })
  return sortedPathObjs.map((obj) => {
    return obj.path
  })
}

// Turn plain RAML paths into objects of type {priority: INT, path: STRING}
// E.g.:
// > const FEATURES_PRIORITY = {methodresponses: 4}
// > extendWithPriority('/foo/bar', '/foo/bar/MethodResponses/some/file.raml')
// > {priority: 4, path: '/foo/bar/MethodResponses/some/file.raml'}
// > extendWithPriority('/foo/bar', '/foo/bar/qweqwe/some/file.raml')
// > {priority: 99, path: '/foo/bar/qweqwe/some/file.raml'}
//
// Override this to change logic of picking priority.
function extendWithPriority (ramlsRoot, ramlPaths) {
  return ramlPaths.map((pth) => {
    const piece = getFirstPathPiece(ramlsRoot, pth)
    return {
      path: pth,
      priority: FEATURES_PRIORITY[piece] || 99
    }
  })
}

// Get relative folder 'root' name of RAML file path.
// E.g.:
//  > const ramlsRoot = '/foo/bar'
//  > const ramlPath = '/foo/bar/MethodResponses/some/file.raml'
//  > getFirstPathPiece(ramlsRoot, ramlPath)
//  > 'methodresponses'
function getFirstPathPiece (ramlsRoot, ramlPath) {
  const relPath = path.relative(ramlsRoot, ramlPath)
  return relPath.split(path.sep)[0].toLowerCase()
}

// Generate and write manifest file
function generateManifest (ramlsRoot, ramlPaths) {
  // Generate and write manifest file

  console.log(ramlPaths)
}

// Get absolute path of input folder
function getInputFolderPath () {
  let fpath
  if (process.argv.length > 2 ) {
    fpath = process.argv[2]
  } else {
    fpath = path.join('tests', 'raml-1.0')
  }
  fpath = path.resolve(fpath)

  if(!fs.existsSync(fpath)) {
    console.error(`'${fpath}' not found`)
    return
  }

  if (!fs.lstatSync(fpath).isDirectory()) {
    console.error(`'${fpath}' is not a directory`)
    return
  }
  return fpath
}

main()
