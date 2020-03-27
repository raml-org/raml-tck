# raml-tck-runner
Run several RAML parsers against https://github.com/raml-org/raml-tck

## Generating report

Following command will install all runners, run them and generate HTML report:
```sh
$ make
```

Then you can open generated HTML report (`reports/html/index.html`) in your browser.

## Go
Parsers tested:
* [jumpscale/go-raml](https://github.com/Jumpscale/go-raml/tree/master/raml)
* [go-raml/raml](https://github.com/go-raml/raml)

To generate only Go parsers report:
```sh
$ make clean
$ make all-go
```

## JavaScript
Parsers tested:
* [raml-1-parser](https://github.com/raml-org/raml-js-parser-2)
* [amf-client-js](https://github.com/aml-org/amf)
* [webapi-parser](https://github.com/raml-org/webapi-parser)

To generate only JS parsers report:
```sh
$ make clean
$ make all-js
```

## Python
Parsers tested:
* [ramlfications](https://github.com/spotify/ramlfications)
* [pyraml-parser](https://github.com/an2deg/pyraml-parser)

To generate only Python parsers report:
```sh
$ make clean
$ make all-py
```

## Ruby
Parsers tested:
* [brujula](https://github.com/nogates/brujula)
* [raml-rb](https://github.com/jpb/raml-rb)

To generate only Ruby parsers report:
```sh
$ make clean
$ make all-rb
```

## Java
Parsers tested:
* [webapi-parser](https://github.com/raml-org/webapi-parser)
* [raml-java-parser](https://github.com/raml-org/raml-java-parser)

To generate only Java parsers report:
```sh
$ make clean
$ make all-java
```
