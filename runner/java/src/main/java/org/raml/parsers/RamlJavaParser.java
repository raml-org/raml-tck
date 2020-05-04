package org.raml.parsers;

import org.raml.v2.api.RamlModelBuilder;
import org.raml.v2.api.RamlModelResult;
import org.raml.v2.api.model.common.ValidationResult;

import java.util.concurrent.ExecutionException;
import java.util.List;


// https://github.com/raml-org/raml-java-parser
public class RamlJavaParser implements IParser {
  public void parse(String fpath) throws InterruptedException, ExecutionException, IllegalArgumentException {
    RamlModelResult model = new RamlModelBuilder().buildApi(fpath);
    if (model.hasErrors()) {
      List<ValidationResult> results = model.getValidationResults();
      throw new IllegalArgumentException(results.get(0).getMessage());
    }
  }
}
