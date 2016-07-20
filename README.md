# TCK - Test Compatibility Kit for RAML Parser

The TCK approach will provide a way to separate the test resources from any parser implementation by having a RAML input and comparing it against an expected JSON output representation of that RAML. Each parser needs to provide a way to generate the JSON output from the RAML definition, including valid and invalid outcome.

Enriching the TCK should be a collaborative task between the engineering team, OnPositive and the contributors of the spec. The first step is to agree on an output schema. Following are some examples of inputs and the expected outputs.

# Run tests
The project provides npm script which allows to run tests for latest npm version of JS parser and latest version of Java parser from `https://github.com/mulesoft-labs/rajapa.git`.

Before running the tests you should install npm, node, java and maven.

In order to run the tests execute following commands:
* `git clone https://github.com/mulesoft-labs/raml-tck.git`

* `cd raml-tck`

* `npm run test`

# Contributing Tests

## Contributing a Simple Test

Suppose your RAML test project contains a single API `.raml` file in its root and does not contain Extensions and Overlays. It may contain any number of Library and Fragment `.raml` files as well as `.json`, `.xml`, `.md` and other files, which may be located inside either root folder or its subtree.

Copy the RAML project folder inside the [`src/source/TCK`](https://github.com/mulesoft-labs/raml-tck/tree/master/src/source/TCK) subtree in such a way that it does not have superfolders directly containing `.raml` files.

You may either create TCK JSON file manually from scratch (in this case you must name it <my API RAML file name>-tck.json), or you may use actual `toJSON()` output of the JS parser as starting point. For the second option you should execute
```
npm run generate
```
The script saves the JS parser output as TCK JSON for those test projects which do not have one.

You may also execute `generate` and `test` scripts by single command:
```
npm run all
```

## Script Working Principle

* The test script iterates in the direct order through the [`src/source/TCK`](https://github.com/mulesoft-labs/raml-tck/tree/master/src/source/TCK) subtree and detects possible test project roots.

* Once the script meets a folder containg one or more `.raml` files, it considers it a test project root.

* All subfolders of test project roots are expected to be parts of these projects and, thus, are not traversed by the script.

* The script attempts to load one ore more of `.raml` files located in test project root (see Supported Test Project Cases below) and test them agains TCK JSON files located nearby.

* If the script does not find corresponding JSON files it creates them using actual `toJSON()` output of the JS parser.



## Supported Test Project Cases

The test project cases are distinguished by `.raml` file sets located in project roots.

#### APIs only project
* RAML files in the root: one or more API file, no Extension and Ovelay files, any number of other files.
* TCK JSON filenames: `<API file name>-tck.json`
* Example: [`src/source/TCK/RAML10/Annotations/test001`](https://github.com/mulesoft-labs/raml-tck/tree/master/src/source/TCK/RAML10/Annotations/test001)

#### Single Extension or Overlay project
* RAML files in the root: single file describing Extension or Overlay which extends API, any number of other files.
* TCK JSON filename: `<Master API file name>-tck.json`
* Example: [`src/source/TCK/RAML10/Overlays/test001`](https://github.com/mulesoft-labs/raml-tck/tree/master/src/source/TCK/RAML10/Overlays/test001)

#### Libraries only project
* RAML files in the root: one or more Library file, no API files, any number of other files.
* TCK JSON filenames: `<Library file name>-tck.json`

#### Fragments only project
* RAML files in the root: one or more Fragment file, no other files.
* TCK JSON filenames: `<Fragment file name>-tck.json`
* Example: [`src/source/TCK/RAML10/Fragments/test001`](https://github.com/mulesoft-labs/raml-tck/tree/master/src/source/TCK/RAML10/Fragments/test001)

#### Multiple Extensions and Overlays project
* RAML files in the root: single API file, one or more Extension and Overlay files, any number of other files.
* TCK JSON filename: `<Master API file name>-tck.json`
* Note:  The script looks at the digit indexes located in the ends of Extension and Overlay file names in order to detrmine order of application (abscence of index is interpreted as zero). If the script fails to determine the order, an error message is emited, and the test is not executed.
* Example: [`src/source/TCK/RAML10/Overlays/test023`](https://github.com/mulesoft-labs/raml-tck/tree/master/src/source/TCK/RAML10/Overlays/test023)






 



