## About

Simple test of few RAML Python parsers. Tests simply try to parse a set of examples and report if parser returned an error.

Running tests produces JSON reports.

A fine collection of RAML files can be composed each containing one/few RAML features to test those in isolation.

Uses [raml-tck](https://github.com/raml-org/raml-tck/tree/master/tests/raml-1.0) as a source of RAML for tests.

NOTE: If file name contains "invalid" parsing of it is expected to fail.

## Install

```sh
$ git clone git@github.com:raml-org/raml-tck-runner.git
$ cd raml-tck-runner/py
$ pip install -r requirements.txt
$ pip install -e .
```

## Run

```sh
$ raml-test-py --parser PARSER_NAME --outdir ./reports/json
```

## Options

Help:
```sh
$ raml-test-py -h
```

Parser:
```sh
$ raml-test-py --parser ramlfications/pyraml-parser
```

Output JSON report directory (defaults to `./`):
```sh
$ raml-test-py --parser ramlfications --outdir ./reports/json
```
