# RAML TCK

RAML's Test Compatibility Kit (RAML TCK) provides a way for any RAML processor to test its compliance with the RAML 1.0 Spec. RAML TCK contains a set of RAML documents meant to be used to test correct and incorrect usage of each RAML feature.

## Naming convention

- `*valid*.raml`: valid RAML file expected to be successfully processed
- `*invalid*.raml`: invalid RAML file with syntax/semantic/spec error(s), expected to be unsuccessfully processed (error or exit code returned)

Note that this repository contains a [manifest file](./manifest.json) that lists all tests in the order their respective tested features appear in the RAML 1.0 Spec.

## Projects using this TCK

Here are a few projects that have been tested against RAML TCK:
* Go: [Jumpscale/go-raml](https://github.com/Jumpscale/go-raml), [go-raml/raml](https://github.com/go-raml/raml)
* JavaScript: [amf-client-js](https://github.com/aml-org/amf), [raml-1-parser](https://github.com/raml-org/raml-js-parser-2), [webapi-parser](https://github.com/raml-org/webapi-parser)
* Python: [ramlfications](https://github.com/spotify/ramlfications), [pyraml-parser](https://github.com/an2deg/pyraml-parser)
* Ruby: [brujula](https://github.com/nogates/brujula), [raml-rb](https://github.com/jpb/raml-rb)
* Java: [amf](https://github.com/aml-org/amf), [webapi-parser](https://github.com/raml-org/webapi-parser), [raml-java-parser](https://github.com/raml-org/raml-java-parser)

(Feel free to submit a PR to list any other tool that may be using the RAML TCK)

A compilation of the above project test results can be found on [this page](http://raml-org.github.io/raml-tck/). Those results have been generated using [raml-tck-runner](https://github.com/raml-org/raml-tck-runner).

## Contributing

We welcome contributions! If you have a new test case in mind, feel free to submit a pull request. More info on how to do that [here](./CONTRIBUTING.md).
