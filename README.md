# TCK - Test Compatibility Kit for API Specs Implementations

This repository contains a set of documents that API tools can use to test their implementations.
Typically an API application is:
 * API parser
 * API converters

Implementors can download or automatically fetch this suite and run their implementation against it. An example on running the suite against the JS parser can be found inside the `examples` folder at the root of this repository.

Running more complex unit tests for the tool implementations within the test framework of choice is still the job of the tool implementor. 

## Structure of a Test

If you're going to use this suite, you need to know how tests are laid out. The tests are contained in the `tests` directory at the root of this repository.

#### Directory

The directory indicates the abstract feature to test, regardless spec and version.

    /tests/<abstract_feature>/...
    
##### Work in progress
We are working in a refactor of the directory from an older definition to this one, please dont add anything below a "raml-1.0". Any doubt let us know.
    
#### File nomenclature

Apart from what it tests, the names of the files determines what spec/version is.

    /root-title_Ov2-0.json      --> Openapi 2.0 file
    /root-title_Rv0-8.raml      --> Raml 0.8 file
    
* AF: Abstract API Design Feature
* SPEC: Letter to identify the spec (R=Raml, O=OpenApi, J=JsonLD)
* OSV: Original Spec & Version (format: \<SPEC>v\<Major>-\<Minor>, example: "Rv0-8")
* DSV: Destination Spec & Version (only for conversion) (format: same as OSV)
* Extension: Test file extension should be appropriate for specification and version that will be tested. Only exception will be “.errors” for invalid tests that wants to check errors.

\<AF>\_\<OSV>_\<DSV>Extension

Example:

We want to test the title feature in the root section across multiple specs and versions:

* Title in a 1.0 Raml file: **root-title_Rv1-0.raml**
* Title in a 2.0 OpenApi file: **root-title_Ov2-0.json**
* Title in a 2.0 OpenApi file that is the result of the conversion from a 0.8 Raml file: **root-title_Rv0-8_Ov2-0.json**
* An invalid 0.8 Raml file with errors:
    * **test-config.json** (metadata file, where it is configured that a particular test is invalid) 
    * **root-title-invalid_Rv0-8.raml** 
    * **root-title-invalid_Rv0-8.errors** (file with info about the errors)


    
#### Metadata
    
And with the help of a config file you can define if a test its valid or not, among other things:

    /test-config.json

Inside each `test-config.json` file is a single object containing information about the test cases covered. 

| Property | Description |
|:--------|:-----------|
| tests | Contains a single array containing objects. See table below. |

| Property | Description |
|:---------|:------------|
| description | A simple description of a single test. |
| input | Name of the file that's being tested. (name of the file without spec/version & extension) |
| valid | Indicates if the file is a valid file for his respective spec and version, true by default |

Example:

```json
{
  "tests": [
    {
      "description": "Useful description of what is the purpose of this file test",
      "input": "filename",  // name of the file without spec/version & extension
      "valid": false        // true by default
    },
    {
      "description": "desc",
      "input": "filename2"
    }
  ]
}
```

#### Errors definition (coming soon)

In the future for invalid tests, you can create a file with the expected errors inside of it:

    /root-title_Rv0-8.raml
    /root-title_Rv0-8.errors  <--
    
#### Example
            
So a fully implemented structure would look like this:

    /tests
        /root-section
            /title
                /root-title-invalid_Rv0-8.errors
                /root-title-invalid_Rv0-8.raml
                /root-title_Ov2-0.json
                /root-title_Rv0-8.raml
                /root-title_Rv0-8_Ov2-0.json
                /test-config.json
		

## How do I use this suite?

If you don't know how to run this suite against your tool, you only need to look at the `examples` directory that executes the suite against [JS parser](https://github.com/raml-org/raml-js-parser-2).

Please execute the following commands from the `node` subdirectory:

```
npm install
node index.js
```

After running `node index.js` you should have a `report.html` that you can open in your browser. Hopefully without any errors reported ;) 

## Contribution 

If you see something missing or incorrect, a pull request is most welcome!

Please make sure you add all necessary information to the `test-config.json` files that will be used to run the suite.