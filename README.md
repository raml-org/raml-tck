# TCK - Test Compatibility Kit for RAML Parser Implementations

This repository contains a set of RAML documents that implementors of a RAML parser can use to test their implementations.

It is meant to be language agnostic and should require only a RAML parser.

Implementors can download or automatically fetch this suite and run their implementation against it. An example on running the suite against the JS parser can be found inside the `examples` folder at the root of this repository.

Running more complex unit tests for the parser implementations within the test framework of choice is still the job of the parser implementor. 

## Structure of a Test

If you're going to use this suite, you need to know how tests are laid out. The tests are contained in the `tests` directory at the root of this repository.

Currently, this suite  only supports if a specific parser implementation correctly validates a given RAML document.

Tests are divided into three areas:

* Semantic Tests
* Syntactical Tests
* Specifications Examples

Those provide a logical separation and is reflected as a subdirectory inside the `tests` directory. 

Inside those directories there is a subdirectory for each version of RAML. We'll use RAML 1.0 as an example. 

If you look inside the RAML 1.0 directory, there are a number of subdirectories each with `test-config.json` files, which logically group a set of test cases together.

Inside each `test-config.json` file is a single object containing information about the test cases covered. It's easiest to illustrate the structure of these with an example:

```json
{
  "section": "syntax/data-types/object",
  "ramlversion": "1.0",
  "tests": [
    {
      "description": "value of 'additionProperties' must be a boolean but is object",
      "input": "additionalProperties-wrong-value.raml",
      "valid": false,
      "tags": [
        "type", "object", "additional property"
      ]
    },
    {
      "description": "enum should be allowed on objects",
      "input": "enum.raml",
      "valid": true,
      "tags": [
        "type", "object"
      ]
    }
  ]
}
```

| Property | Description |
|:--------:|:-----------:|
| section | Contains a unique id for this section, usually the directory structure |
| ramlVersion | The RAML version being covered by the test cases |
| tests | Contains a single array containing objects. See table below. |

`tests`

| Property | Description |
|:--------:|:-----------:|
| description | A simple description of a single test. |
| input | Relative path to the file that's being tested. |
| valid | Indicates what is expected. If it's `true`, a parser implementation shouldn't report any errors; and with `false` a parser should report errors. |
| tags | A list of tags correspondent to a single test. Please see [common-tags.md](common-tags.md) for common used tags. |

## Coverage

RAML 0.8 and 1.0 should have full coverage. If you see anything missing or think there is a useful test missing, please send a pull request or open an issue.

## Contribution 

If you see something missing or incorrect, a pull request is most welcome!

Please make sure you add all necessary information to the `test-config.json` files that will be used to run the suite.