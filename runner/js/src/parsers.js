const raml = require('raml-1-parser')
const amf = require('amf-client-js')
const wap = require('webapi-parser').WebApiParser

// https://github.com/raml-org/raml-js-parser-2
async function raml1parserParse (fpath) {
  const res = raml.loadSync(fpath)
  if (res.errors.length > 0) {
    throw new Error(res.errors[0].message)
  }
  return res
}

// https://github.com/aml-org/amf
async function amfParse (fpath) {
  await amf.AMF.init()
  const ramlParser = amf.AMF.raml10Parser()
  const model = await ramlParser.parseFileAsync(`file://${fpath}`)
  const report = await amf.AMF.validate(
    model, amf.ProfileNames.RAML10, amf.MessageStyles.RAML)
  if (!report.conforms) {
    report.results.map(res => {
      if (res.level.toLowerCase() === 'violation') {
        throw new Error(res.message)
      }
    })
  }
}

// https://github.com/raml-org/webapi-parser
async function webapiParserParse (fpath) {
  const model = await wap.raml10.parse(`file://${fpath}`)
  const report = await wap.raml10.validate(model)
  if (!report.conforms) {
    report.results.map(res => {
      if (res.level.toLowerCase() === 'violation') {
        throw new Error(res.message)
      }
    })
  }
}

module.exports = {
  raml1parserParse: raml1parserParse,
  amfParse: amfParse,
  webapiParserParse: webapiParserParse
}
