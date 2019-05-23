# Contributing

Each test case must contain the following files:
* A valid `*valid*.raml` file showcasing valid use of the feature under test
* An invalid `*invalid*.raml` files showcasing invalid use of the feature under test

and optionally:
* Any number of Library and Fragment `.raml` files as well as `.json`, `.xml`, `.md`, and any other files in either the root folder or its subtree. These files must be used by the main valid/invalid `.raml` files.

Test cases must be put under the `tests` directory by either putting your tests into an existing folder or creating a new one. Hereby, it is important that the folder name does reflect the main purpose and each file name should also be meaningful. For example, if you want to contribute a new test case that covers traits in RAML 1.0, you only need to create a new folder for your test case under `tests/raml-1.0/Traits` and copy your RAML files into that. 

## Running tests

We've created a separate project called [raml-tck-runner](https://github.com/raml-org/raml-tck-runner) to run all the tests contained in the RAML TCK. By following the instructions on that repository, you should be able to test any new test case that you may want to contribute against the different projects that this [raml-tck-runner](https://github.com/raml-org/raml-tck-runner) covers.
