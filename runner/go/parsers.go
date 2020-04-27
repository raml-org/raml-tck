package main

import (
	"fmt"
	jumpscale "github.com/postatum/go-raml/raml"
	tsaikd "github.com/tsaikd/go-raml-parser/parser"
	goraml "gopkg.in/raml.v0" // github.com/go-raml/raml
)

// Parser is a parsing type function
type Parser func(string) (error, bool)

func recovery() {
	if r := recover(); r != nil {
		fmt.Println("PANIC:", r)
	}
}

// Jumpscale runs https://github.com/Jumpscale/go-raml/tree/master/raml
func Jumpscale(fpath string) (error, bool) {
	defer recovery()
	apiDef := &jumpscale.APIDefinition{}
	return jumpscale.ParseFile(fpath, apiDef), true
}

// Goraml runs https://github.com/go-raml/raml
func Goraml(fpath string) (error, bool) {
	defer recovery()
	_, err := goraml.ParseFile(fpath)
	return err, true
}

// Tsaikd runs https://github.com/tsaikd/go-raml-parser/tree/master/parser
// NOTE: It doesn't produce JSON output because it causes fatal error.
func Tsaikd(fpath string) (error, bool) {
	defer recovery()
	ramlParser := tsaikd.NewParser()
	_, err := ramlParser.ParseFile(fpath)
	return err, true
}
