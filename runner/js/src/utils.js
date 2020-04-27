const path = require('path')
const fs = require('fs')

/* Lists raml files in folder */
function listRamls (foldPath) {
  const manifestPath = path.join(foldPath, 'manifest.json')
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
  return manifest.filePaths.map((filePath) => {
    return path.join(foldPath, filePath)
  })
}

/* Writes JSON report to output folder */
function saveReport (report, outdir) {
  outdir = path.resolve(outdir)
  try { fs.mkdirSync(outdir) } catch(e) {}
  const fpath = path.join(
    outdir,
    `${report.parser.name}_${report.parser.language}.json`)
  fs.writeFileSync(fpath, JSON.stringify(report, null, 2))
}

module.exports = {
  listRamls: listRamls,
  saveReport: saveReport
}
