## About

Simple test of few RAML Ruby parsers. Tests simply try to parse a set of examples and report if parser returned an error.

Running tests produces JSON reports.

A fine collection of RAML files can be composed each containing one/few RAML features to test those in isolation.

Uses [raml-tck](https://github.com/raml-org/raml-tck/tree/master/tests/raml-1.0) as a source of RAML for tests.

NOTE: If file name contains "invalid" parsing of it is expected to fail.

## Install

```sh
$ git clone git@github.com:raml-org/raml-tck-runner.git
$ cd raml-tck-runner/rb
$ bundle install
```

## Run

```sh
$ ruby main.rb --parser PARSER_NAME --outdir ./reports/json
```

## Options

Help:
```sh
$ ruby main.rb -h
```

Parser:
```sh
$ ruby main.rb --parser brujula/raml-rb --branch develop
```

Output JSON report directory (defaults to `./`):
```sh
$ ruby main.rb --parser brujula --outdir ./reports/json --branch develop
```

raml-tck branch to load RAML files from:
```sh
$ ruby main.rb --parser brujula --branch develop
```
