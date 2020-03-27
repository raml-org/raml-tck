const path = require('path')
const parseArgs = require('minimist')
const parsers = require('./parsers')
const utils = require('./utils')
const package = require('../package.json')

const ROOT_DIR = path.resolve(path.join(
  __dirname, // raml-tck/runner/js/src
  '..', // raml-tck/runner/js
  '..', // raml-tck/runner
  '..' // raml-tck
))

const PARSERS = {
  'raml-1-parser': parsers.raml1parserParse,
  'amf-client-js': parsers.amfParse,
  'webapi-parser': parsers.webapiParserParse
}

/**
 * Parsers meta-data which helps generating pretty reports.
 * Required fields are: url, version.
 * Name and language are used in links creation.
 */
const PARSERS_META = {
  'raml-1-parser': {
    url: 'https://github.com/raml-org/raml-js-parser-2',
    version: package.dependencies['raml-1-parser']
  },
  'amf-client-js': {
    url: 'https://github.com/aml-org/amf',
    version: package.dependencies['amf-client-js']
  },
  'webapi-parser': {
    url: 'https://github.com/raml-org/webapi-parser',
    version: package.dependencies['webapi-parser']
  }
}



async function main () {
  const argv = parseArgs(process.argv.slice(2))
  const parserFunc = PARSERS[argv.parser]
  if (parserFunc === undefined) {
    console.log(`Not supported parser: ${argv.parser}`)
    return
  }

  const fileList = utils.listRamls(ROOT_DIR)
  let report = {
    parser: {
      name: argv.parser,
      language: 'js',
      ...PARSERS_META[argv.parser]
    },
    results: [],
    branch: argv.branch
  }

  for (let i = 0; i < fileList.length; i++) {
    let fpath = fileList[i]
    let success = true
    let error
    try {
      await parserFunc(fpath)
    } catch (e) {
      success = false
      error = e
    }
    report.results.push({
      file: fpath.replace(ROOT_DIR, ''),
      success: success,
      error: error ? error.toString() : error
    })
  }

  utils.saveReport(report, argv.outdir || './')
}

main()
