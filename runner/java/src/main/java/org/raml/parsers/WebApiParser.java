package org.raml.parsers;

import webapi.Raml10;
import webapi.WebApiBaseUnit;
import amf.client.validate.ValidationReport;
import amf.client.validate.ValidationResult;

import java.util.concurrent.ExecutionException;
import java.util.List;


// https://github.com/raml-org/webapi-parser
public class WebApiParser implements IParser {
  public void parse(String fpath) throws InterruptedException, ExecutionException, IllegalArgumentException {
    final WebApiBaseUnit model = Raml10.parse("file://" + fpath).get();
    final ValidationReport report = Raml10.validate(model).get();
    final List<ValidationResult> results = report.results();
    for (ValidationResult res : results) {
      if (!report.conforms() && res.level().toLowerCase().equals("violation")) {
        throw new IllegalArgumentException(res.message());
      }
    }
  }
}
