# TCK - Test Compatibility Kit for RAML Parser

The Test Compatibility Kit (TCK) for the RAML Parser provides a way to separate the test resources from any parser implementation. TCK compares a RAML input against an expected JSON output representation of that RAML.  Each parser needs to provide a way to generate the JSON output from the RAML definition, including valid and invalid outcomes.

The expected output representation is defined by the following [schema](schema/tckJsonSchema.json).

# Run tests

The [JS parser repository](https://github.com/raml-org/raml-js-parser-2/blob/develop/README.md#launching-tck-tests) contains a sample implementation for running the TCK tests against a parser implementation.

# Contributing Tests

We welcome any contributions from the community! You can contribute by sending us a pull request with your test cases. A test case, for example, might contain the following files:

* A single API `.raml` file in its root
* Optionally, any number of Library and Fragment `.raml` files as well as `.json`, `.xml`, `.md`, and other files in either the root folder or its subtree

Test cases must be put under the `tests` directory by either putting your tests into an existing folder or creating a new one. Hereby, it is important that the folder name does reflect the main purpose and each file name should also be meaningful. For example, if you want to contribute a new test case that covers traits in RAML 1.0, you only need to create a new folder for your test case under `tests/raml-1.0/Traits` and copy your RAML files into that.

Each test needs to have a TCK specific file that will be actually used as a comparison for the output of your parsing. You can create a TCK JSON file manually from scratch, and  name it `<my API RAML file name>-tck.json`), or use the generate script provided inside the `src` directory. For example, you create a  folder inside the `tests/raml-1.0/Traits` directory called `myTests` where you put all your tests files. Now, you only need to go to your terminal and execute the following:

Install dependencies

```
npm install
```

Run

```
node src/index.js tests/raml-1.0/Traits/myTests
```

This file will navigates through your directory and generate the necessary TCK file.

The next section will explain the structure each new TCK test directory must follow.

## Standard directory structure for TCK test folders

The test cases are distinguished by `.raml` file sets located in project roots.

#### APIs only project

* RAML files in the root: one or more API files, no Extension and Overlay files, and any number of other files
* TCK JSON filenames: `<API file name>-tck.json`
* Example: [`tests/raml-1.0/Annotations/test001`](tests/raml-1.0/Annotations/test001)

#### Single Extension or Overlay project

* RAML files in the root: single file describing Extension or Overlay which extends API, any number of other files.
* TCK JSON filename: `<Master API file name>-tck.json`
* Example: [`tests/raml-1.0//Overlays/test001`](tests/raml-1.0/Overlays/test001)

#### Libraries only project

* RAML files in the root: one or more Library file, no API files, any number of other files.
* TCK JSON filenames: `<Library file name>-tck.json`

#### Fragments only project

* RAML files in the root: one or more Fragment file, no other files.
* TCK JSON filenames: `<Fragment file name>-tck.json`
* Example: [`tests/raml-1.0/Fragments/test001`](tests/raml-1.0/RAML10/Fragments/test001)

#### Multiple Extensions and Overlays project

* RAML files in the root:
  * Master API file
  * One or more Extension and Overlay files which form a chain orderd by extension relation (with one end in the master API)
  * Any number of other files
* TCK JSON filename: `<Master API file name>-tck.json`
* Example: [`tests/raml-1.0/Overlays/test023`](tests/raml-1.0/Overlays/test023)
