package rajapatest;

import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintStream;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.raml.v2.api.RamlModelBuilder;
import org.raml.v2.api.RamlModelResult;
import org.raml.v2.api.model.common.ValidationResult;

public class Main {
	private static PrintStream systemOut = System.out;
	
	public static void main(String[] args) {
		turnSystemOutOff();
		
		RamlModelResult ramlModelResult = null;
		
		JSONObject resultJson = new JSONObject();
		
		try {
			ramlModelResult = new RamlModelBuilder().buildApi(args[0]);
			
			if(ramlModelResult.hasErrors()) {
				JSONArray errorMessages = new JSONArray();
				
				for(ValidationResult validationResult : ramlModelResult.getValidationResults()) {
					errorMessages.add(validationResult.getMessage());
				}
				
				resultJson.put("errors", errorMessages);
			}
		} catch (Throwable t) {		
			resultJson.put("exception", "something wrong");
		}
		
		turnSystemOutOn();
		
		System.out.println(resultJson.toJSONString());
	}
	
	private static void turnSystemOutOff() {
		System.setOut(new PrintStream(new OutputStream() {
			public void write(int b) throws IOException {
				
			}
		}));
	}
	
	private static void turnSystemOutOn() {
		System.setOut(systemOut);
	}
}