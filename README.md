# TCK - Test Compatibility Kit for RAML Parser

The Test Compatibility Kit (TCK) for the RAML Parser provides a way to separate the test resources from any parser implementation. TCK contains a set of RAML documents meant to be used to test correct/incorrect usage of each RAML feature. Note that only the failure or success to parse is tested, not the parsing outcome per sé.

# Naming convention

*valid-\*.raml*: Valid RAML file parsing of which is expected to succeed.

*invalid-\*.raml*: Invalid RAML file that has syntax/semantic/spec errors. Parsing of it is expected to fail (parser errors/returns error/crashes).

Repository also contains a [manifest file](tests/raml-1.0/manifest.json) that lists RAML files in the order features used in them are defined in RAML 1.0 spec.

# Run tests

There are already few parsing tools that use the repo and test some parsers:

**[raml-tck-runner](https://github.com/raml-org/raml-tck-runner)** tests parsers:
* Go: [Jumpscale/go-raml](https://github.com/Jumpscale/go-raml), [go-raml/raml](https://github.com/go-raml/raml)
* JavaScript: [raml-1-parser](https://github.com/raml-org/raml-js-parser-2), [amf-client-js](https://github.com/aml-org/amf), [webapi-parser](https://github.com/raml-org/webapi-parser)
* Python: [ramlfications](https://github.com/spotify/ramlfications), [pyraml-parser](https://github.com/an2deg/pyraml-parser)
* Ruby: [brujula](https://github.com/nogates/brujula), [raml-rb](https://github.com/jpb/raml-rb)
* Java: [webapi-parser](https://github.com/raml-org/webapi-parser), [raml-java-parser](https://github.com/raml-org/raml-java-parser)

Feel free to build more tools to fit your needs.

# Contributing Tests

We welcome any contributions from the community! You can contribute by sending us a pull request with your test cases. A test case, for example, should contain the following files:

* Valid `.raml` file showcasing valid use of the feature under test
* Invalid `.raml` files showcasing invalid use of the feature under test
* Optionally, any number of Library and Fragment `.raml` files as well as `.json`, `.xml`, `.md`, and other files in either the root folder or its subtree. These files must be used by the main valid/invalid `.raml` files.

Test cases must be put under the `tests` directory by either putting your tests into an existing folder or creating a new one. Hereby, it is important that the folder name does reflect the main purpose and each file name should also be meaningful. For example, if you want to contribute a new test case that covers traits in RAML 1.0, you only need to create a new folder for your test case under `tests/raml-1.0/Traits` and copy your RAML files into that. Please also make sure that you place additional metadata as comments into your RAML file to give more context about your test case. The following is a template:

```
<RAML_VERSION> <RAML_FRAGMENT>

# Objective: <COMMENT>
# Expected result: <COMMENT>

# <COMMENT>

# tags: <tag_1>, <tag_2>, ...,<tag_n>

<RAML_CONTENT>
```

For more information, please have a look at [this example](tests/raml-1.0/spec-examples/APIs/additional-facets-single-example.raml).

For more information what tags to use, please see a list of commonly used inside [common-tags.md](common-tags.md). You can suggest new by raising an issue within this repository.

After adding new files make sure to regenerate the manifest file:

Install dependencies:

```sh
$ npm install
```

Generate the manifest:

```sh
$ npm run-script gen-manifest
```
