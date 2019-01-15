const path = require('path')
const fs = require('fs')
const walk = require('walk')

function main () {
  const projRoot = path.resolve(path.join(__dirname, '..'))
  const inputRoot = getInputDirPath()
  let ramlPaths = listRamls(inputRoot)
  ramlPaths = sortRAMLPaths(inputRoot, ramlPaths)
  ramlPaths = makePathsRelative(projRoot, ramlPaths)
  generateManifest(projRoot, ramlPaths)
}

// Gets absolute path of input folder
function getInputDirPath () {
  let dirPath = process.argv[2]

  if (!fs.existsSync(dirPath)) {
    console.error(`'${dirPath}' not found`)
    return
  }

  dirPath = path.resolve(dirPath)
  if (!fs.lstatSync(dirPath).isDirectory()) {
    console.error(`'${dirPath}' is not a directory`)
    return
  }
  return dirPath
}

// Lists RAML files under directory path
function listRamls (dirPath) {
  let files = []
  const options = {
    listeners: {
      file: (root, fileStats, next) => {
        if (fileStats.name.indexOf('.raml') >= 0) {
          files.push(path.join(root, fileStats.name))
        }
        next()
      }
    }
  }
  walk.walkSync(dirPath, options)
  return files
}

// Sorts string ramlPaths according to features definition order
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

// Makes RAML fiels paths relative to a directory
function makePathsRelative (dirPath, ramlPaths) {
  return ramlPaths.map((pth) => {
    return path.relative(dirPath, pth)
  })
}

// Turns plain RAML paths into objects of type {priority: INT, path: STRING}
// E.g.:
// > let featuresPriority = ['methodresponses', 'overlays']
// > extendWithPriority('/foo/bar', '/foo/bar/Overlays/some/file.raml')
// > {priority: 2, path: '/foo/bar/Overlays/some/file.raml'}
// > extendWithPriority('/foo/bar', '/foo/bar/qweqwe/some/file.raml')
// > {priority: 3, path: '/foo/bar/qweqwe/some/file.raml'}
//
// Override this to change logic of picking priority.
function extendWithPriority (ramlsRoot, ramlPaths) {
  // Features listed in order they appear in RAML 1.0 spec.
  let featuresPriority = [
    'root',
    'types',
    'resources',
    'methods',
    'responses',
    'methodresponses',
    'resourcetypes',
    'traits',
    'templatefunctions',
    'securityschemes',
    'annotations',
    'fragments',
    'libraries',
    'overlays'
  ]
  return ramlPaths.map((pth) => {
    const piece = getFirstPathPiece(ramlsRoot, pth)
    let priority = featuresPriority.findIndex((el) => {
      return el === piece
    })
    // Feature name not found. Adding it to the list allows sorting not
    // found features.
    if (priority === -1) {
      featuresPriority.push(piece)
      priority = featuresPriority.length - 1
    }
    priority += 1 // Make 1-based
    return {path: pth, priority: priority}
  })
}

// Gets relative folder 'root' name of RAML file path.
// E.g.:
//  > const ramlsRoot = '/foo/bar'
//  > const ramlPath = '/foo/bar/MethodResponses/some/file.raml'
//  > getFirstPathPiece(ramlsRoot, ramlPath)
//  > 'methodresponses'
function getFirstPathPiece (ramlsRoot, ramlPath) {
  const relPath = path.relative(ramlsRoot, ramlPath)
  return relPath.split(path.sep)[0].toLowerCase()
}

// Generates and writes manifest file
function generateManifest (dirPath, ramlPaths) {
  const data = {
    description: 'RAML files listed in order corresponding RAML ' +
                 'feature appears in RAML 1.0 spec',
    filePaths: ramlPaths
  }
  const manifestPath = path.join(dirPath, 'manifest.json')
  console.log(`Writing manifest file to ${manifestPath}`)
  fs.writeFileSync(manifestPath, JSON.stringify(data, null, 4))
}

main()
