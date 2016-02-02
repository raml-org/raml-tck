# TCK - Test Compatibility Kit for RAML Parser

The TCK approach will provide a way to separate the test resources from any parser implementation by having a RAML input and comparing it against an expected JSON output representation of that RAML. Each parser needs to provide a way to generate the JSON output from the RAML definition, including valid and invalid outcome.

Enriching the TCK should be a collaborative task between the engineering team, OnPositive and the contributors of the spec. The first step is to agree on an output schema. Following are some examples of inputs and the expected outputs.
