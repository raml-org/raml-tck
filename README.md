# TCK - Test Compatibility Kit for RAML Parser

The TCK approach will provide a way to separate the test resources from any parser implementation by having a RAML input and comparing it against an expected JSON output representation of that RAML. Each parser needs to provide a way to generate the JSON output from the RAML definition, including valid and invalid outcome.

Enriching the TCK should be a collaborative task between the engineering team, OnPositive and the contributors of the spec. The first step is to agree on an output schema. Following are some examples of inputs and the expected outputs.

# Run tests
The project provides npm script which allows to run tests for latest npm version of JS parser and latest version of Java parser from `https://github.com/mulesoft-labs/rajapa.git`.

Before running the tests you should install npm, node, java and maven.

In order to run the tests execute following commands:
* `git clone https://github.com/mulesoft-labs/raml-tck.git`

* `cd raml-tck`

* `npm run start`


