## About

Simple test of few RAML Go parsers. Tests simply try to parse a set of examples and report if parser returned an error.

Running tests produces JSON reports.

A fine collection of RAML files can be composed each containing one/few RAML features to test those in isolation.

Uses [raml-tck](https://github.com/raml-org/raml-tck/tree/master/tests/raml-1.0) as a source of RAML for tests.

NOTE: If file name contains "invalid" parsing of it is expected to fail.

## Install

```sh
$ git clone git@github.com:raml-org/raml-tck-runner.git
$ mkdir -p $GOPATH/src/github.com/raml-org/raml-tck-runner-go
$ cp raml-tck-runner/go/* $GOPATH/src/github.com/raml-org/raml-tck-runner-go
$ cd $GOPATH/src/github.com/raml-org/raml-tck-runner-go
$ go get
$ go install
```

## Run

```sh
$ raml-tck-runner-go -parser PARSER_NAME -outdir ./reports/json
```

## Options

Help:

```sh
$ raml-tck-runner-go -h
```

Parser (defaults to `jumpscale`):
```sh
$ raml-tck-runner-go -parser jumpscale/go-raml -branch develop
```

Output JSON report directory (defaults to `./`):
```sh
$ raml-tck-runner-go -parser jumpscale -outdir ./reports/json -branch develop
```

raml-tck branch to load RAML files from:
```sh
$ raml-tck-runner-go -parser jumpscale -branch develop
```
