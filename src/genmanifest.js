const path = require('path')
const fs = require('fs')
const walk = require('walk')

// Features listed in order they appear in RAML 1.0 spec.
// Features names correspond to lowercase names of tests/raml-1.0
// sub-folders.
const FEATURES_PRIORITY = [
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

function main () {
  const fpath = getInputFolderPath()
  let ramlPaths = listRamls(fpath)
  ramlPaths = sortRAMLPaths(fpath, ramlPaths)
  generateManifest(fpath, ramlPaths)
}

// List RAML files under fpath
function listRamls (fpath) {
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
  walk.walkSync(fpath, options)
  return files
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
// > const FEATURES_PRIORITY = ['methodresponses', 'overlays']
// > extendWithPriority('/foo/bar', '/foo/bar/Overlays/some/file.raml')
// > {priority: 2, path: '/foo/bar/Overlays/some/file.raml'}
// > extendWithPriority('/foo/bar', '/foo/bar/qweqwe/some/file.raml')
// > {priority: 99, path: '/foo/bar/qweqwe/some/file.raml'}
//
// Override this to change logic of picking priority.
function extendWithPriority (ramlsRoot, ramlPaths) {
  return ramlPaths.map((pth) => {
    const piece = getFirstPathPiece(ramlsRoot, pth)
    let priority = FEATURES_PRIORITY.findIndex((el) => { return el === piece })
    priority += 1 // Make 1-based
    return {
      path: path.relative(ramlsRoot, pth),
      priority: priority || 99
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
  const data = {
    description: 'RAML files listed in order corresponding RAML ' +
                 'feature appears in RAML 1.0 spec',
    filePaths: ramlPaths
  }
  const manifestPath = path.join(ramlsRoot, 'manifest.json')
  console.log(`Writing manifest file to ${manifestPath}`)
  fs.writeFileSync(manifestPath, JSON.stringify(data, null, 4))
}

// Get absolute path of input folder
function getInputFolderPath () {
  let fpath
  if (process.argv.length > 2) {
    fpath = process.argv[2]
  } else {
    fpath = path.join('tests', 'raml-1.0')
  }
  fpath = path.resolve(fpath)

  if (!fs.existsSync(fpath)) {
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
