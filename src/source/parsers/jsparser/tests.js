var path = require("path");
var fs = require("fs");
var assert = require("assert");
var parserAPI = require('raml-1-parser');

describe('TCK. Types tests.', function () {
    it("Simple type with string property.", function () {
        testAPI('TCK/RAML10/Types/test1/apiValid.raml');
    });

    it("Simple type extension.", function () {
        testAPI('TCK/RAML10/Types/test2/apiValid.raml');
    });

    it("Simple type extension, negative example test.", function () {
        testAPI('TCK/RAML10/Types/test2/apiInvalid.raml');
    });

    it("Complex type.", function () {
        testAPI('TCK/RAML10/Types/test3/apiValid.raml');
    });

    it("Complex type. negative example test.", function () {
        testAPI('TCK/RAML10/Types/test3/apiInvalid.raml');
    });

    it("Simple array type.", function () {
        testAPI('TCK/RAML10/Types/test4/apiValid.raml');
    });

    it("Simple array type, negative example test.", function () {
        testAPI('TCK/RAML10/Types/test4/apiInvalid.raml');
    });

    it("Complex array type.", function () {
        testAPI('TCK/RAML10/Types/test5/apiValid.raml');
    });

    it("Complex array type, negative example test.", function () {
        testAPI('TCK/RAML10/Types/test5/apiInvalid.raml');
    });

    it("Simple union type.", function () {
        testAPI('TCK/RAML10/Types/test6/apiValid.raml');
    });

    it("Simple union type, negative example test.", function () {
        testAPI('TCK/RAML10/Types/test6/apiInvalid.raml');
    });

    it("Scalar union array type.", function () {
        testAPI('TCK/RAML10/Types/test7/apiValid.raml');
    });

    it("Scalar union array type, negative example test.", function () {
        testAPI('TCK/RAML10/Types/test7/apiInvalid.raml');
    });

    it("Complex union array type 1.", function () {
        testAPI('TCK/RAML10/Types/test8/apiValid.raml');
    });

    it("Complex union array type 1, negative example test.", function () {
        testAPI('TCK/RAML10/Types/test8/apiInvalid.raml');
    });

    it("Complex union array type 2.", function () {
        testAPI('TCK/RAML10/Types/test9/apiValid.raml');
    });

    it("Complex union array type 2, negative example test.", function () {
        testAPI('TCK/RAML10/Types/test9/apiInvalid.raml');
    });

    it("Complex array type extension.", function () {
        testAPI('TCK/RAML10/Types/test10/apiValid.raml');
    });

    it("Scalar array type extension.", function () {
        testAPI('TCK/RAML10/Types/test11/apiValid.raml');
    });

    it("Cyclic dependency 1.", function () {
        testAPI('TCK/RAML10/Types/test12/apiValid.raml');
    });

    it("Cyclic dependency 1, negative example test.", function () {
        testAPI('TCK/RAML10/Types/test12/apiInvalid.raml');
    });

    it("Cyclic dependency 2.", function () {
        testAPI('TCK/RAML10/Types/test13/apiValid.raml');
    });

    it("Recurrent type definition 1.", function () {
        testAPI('TCK/RAML10/Types/test14/apiInvalid.raml');
    });

    it("Recurrent type definition 2.", function () {
        testAPI('TCK/RAML10/Types/test15/apiInvalid.raml');
    });

    it("Recurrent type definition 3.", function () {
        testAPI('TCK/RAML10/Types/test16/apiInvalid.raml');
    });

    it("Recurrent type definition 4.", function () {
        testAPI('TCK/RAML10/Types/test17/apiInvalid.raml');
    });
});

describe('TCK. Resources tests.', function () {
    it("Simple resource.", function () {
        testAPI('TCK/RAML10/Resources/test1/apiValid.raml');
    });

    it("Simple resource. Negative test.", function () {
        testAPI('TCK/RAML10/Resources/test1/apiInvalid.raml');
    });

    it("Simple resource with uri parameters.", function () {
        testAPI('TCK/RAML10/Resources/test2/apiValid.raml');
    });

    it("Simple resource with uri parameters. Negative test.", function () {
        testAPI('TCK/RAML10/Resources/test2/apiInvalid.raml');
    });

    it("Simple resource with response body.", function () {
        testAPI('TCK/RAML10/Resources/test3/apiValid.raml');
    });

    it("Simple resource with response body. Negative test.", function () {
        testAPI('TCK/RAML10/Resources/test3/apiInvalid.raml');
    });

    it("Simple resource with response body inherited from type.", function () {
        testAPI('TCK/RAML10/Resources/test4/apiValid.raml');
    });

    it("Simple resource with response body inherited from type. Negative test.", function () {
        testAPI('TCK/RAML10/Resources/test4/apiInvalid.raml');
    });

    it("Simple resource with request body.", function () {
        testAPI('TCK/RAML10/Resources/test5/apiValid.raml');
    });

    it("Simple resource with request body. Negative test.", function () {
        testAPI('TCK/RAML10/Resources/test5/apiInvalid.raml');
    });

    it("Simple resource with request body inherited from type.", function () {
        testAPI('TCK/RAML10/Resources/test6/apiValid.raml');
    });

    it("Simple resource with request body inherited from type. Negative test.", function () {
        testAPI('TCK/RAML10/Resources/test6/apiInvalid.raml');
    });

    it("Applying resourse type with params 1.", function () {
        testAPI('TCK/RAML10/Resources/test7/apiValid.raml');
    });

    it("Applying resourse type with params 1. Negative example test.", function () {
        testAPI('TCK/RAML10/Resources/test7/apiInvalid.raml');
    });

    it("Applying resourse type with params 2.", function () {
        testAPI('TCK/RAML10/Resources/test8/apiValid.raml');
    });

    it("Applying resourse type with params 2. Negative example test.", function () {
        testAPI('TCK/RAML10/Resources/test8/apiInvalid.raml');
    });

    it("Applying resourse type with params 3.", function () {
        testAPI('TCK/RAML10/Resources/test9/apiValid.raml');
    });

    it("Applying resourse type with params 3. Negative example test.", function () {
        testAPI('TCK/RAML10/Resources/test9/apiInvalid.raml');
    });

    it("Applying resourse type with params 4.", function () {
        testAPI('TCK/RAML10/Resources/test10/apiValid.raml');
    });

    it("Applying resourse type with params 4. Negative example test.", function () {
        testAPI('TCK/RAML10/Resources/test10/apiInvalid.raml');
    });

    it("Applying resourse type with params 5.", function () {
        testAPI('TCK/RAML10/Resources/test11/apiValid.raml');
    });

    it("Applying resourse type with params 5. Negative example test.", function () {
        testAPI('TCK/RAML10/Resources/test11/apiInvalid.raml');
    });

    it("Applying resourse type with params 6.", function () {
        testAPI('TCK/RAML10/Resources/test12/apiValid.raml');
    });

    it("Applying resourse type with params 6. Negative example test.", function () {
        testAPI('TCK/RAML10/Resources/test12/apiInvalid.raml');
    });

    it("Applying resourse type with params 7.", function () {
        testAPI('TCK/RAML10/Resources/test13/apiValid.raml');
    });

    it("Applying resourse type with params 7. Negative example test.", function () {
        testAPI('TCK/RAML10/Resources/test13/apiInvalid.raml');
    });

    it("Applying resourse type with params 8.", function () {
        testAPI('TCK/RAML10/Resources/test14/apiValid.raml');
    });

    it("Applying resourse type with params 8. Negative example test.", function () {
        testAPI('TCK/RAML10/Resources/test14/apiInvalid.raml');
    });

    it("Applying resourse type with params 9.", function () {
        testAPI('TCK/RAML10/Resources/test15/apiValid.raml');
    });

    it("Applying resourse type with params 9. Negative example test.", function () {
        testAPI('TCK/RAML10/Resources/test15/apiInvalid.raml');
    });
});

describe('TCK. Resource types tests.', function () {
    it("Simple resource type.", function () {
        testAPI('TCK/RAML10/ResourceTypes/test1/apiValid.raml');
    });

    it("Simple resource type extension.", function () {
        testAPI('TCK/RAML10/ResourceTypes/test2/apiValid.raml');
    });

    it("Resource type with params 1.", function () {
        testAPI('TCK/RAML10/ResourceTypes/test3/apiValid.raml');
    });

    it("Resource type with params 1. Negative example test.", function () {
        testAPI('TCK/RAML10/ResourceTypes/test3/apiInvalid.raml');
    });

    it("Resource type with params 2.", function () {
        testAPI('TCK/RAML10/ResourceTypes/test4/apiValid.raml');
    });

    it("Resource type with params 2. Negative example test.", function () {
        testAPI('TCK/RAML10/ResourceTypes/test4/apiInvalid.raml');
    });

    it("Resource type with params 3.", function () {
        testAPI('TCK/RAML10/ResourceTypes/test5/apiValid.raml');
    });

    it("Resource type with params 3. Negative example test.", function () {
        testAPI('TCK/RAML10/ResourceTypes/test5/apiInvalid.raml');
    });

    it("Resource type with params 4.", function () {
        testAPI('TCK/RAML10/ResourceTypes/test6/apiValid.raml');
    });

    it("Resource type with params 4. Negative example test.", function () {
        testAPI('TCK/RAML10/ResourceTypes/test6/apiInvalid.raml');
    });

    it("Resource type with params 5.", function () {
        testAPI('TCK/RAML10/ResourceTypes/test7/apiValid.raml');
    });

    it("Resource type with params 5. Negative example test.", function () {
        testAPI('TCK/RAML10/ResourceTypes/test7/apiInvalid.raml');
    });

    it("Resource type with params 6.", function () {
        testAPI('TCK/RAML10/ResourceTypes/test8/apiValid.raml');
    });

    it("Resource type with params 6. Negative example test.", function () {
        testAPI('TCK/RAML10/ResourceTypes/test8/apiInvalid.raml');
    });

    it("Resource type with params 7.", function () {
        testAPI('TCK/RAML10/ResourceTypes/test9/apiValid.raml');
    });

    it("Resource type with params 7. Negative example test.", function () {
        testAPI('TCK/RAML10/ResourceTypes/test9/apiInvalid.raml');
    });

    it("Resource type with params 8.", function () {
        testAPI('TCK/RAML10/ResourceTypes/test10/apiValid.raml');
    });

    it("Resource type with params 8. Negative example test.", function () {
        testAPI('TCK/RAML10/ResourceTypes/test10/apiInvalid.raml');
    });

    it("Resource type with params 9.", function () {
        testAPI('TCK/RAML10/ResourceTypes/test11/apiValid.raml');
    });

    it("Resource type with params 9. Negative example test.", function () {
        testAPI('TCK/RAML10/ResourceTypes/test11/apiInvalid.raml');
    });
});

describe('TCK Raml08. Resource types tests.', function () {
    it("Resource types test 1.", function () {
        testAPI('TCK/Raml08/ResourceTypes/test1/apiValid.raml');
    });

    it("Resource types test 1. Negative example test.", function () {
        testAPI('TCK/Raml08/ResourceTypes/test1/apiInvalid.raml');
    });

    it("Resource types test 2.", function () {
        testAPI('TCK/Raml08/ResourceTypes/test2/apiValid.raml');
    });

    it("Resource types test 2. Negative example test.", function () {
        testAPI('TCK/Raml08/ResourceTypes/test2/apiInvalid.raml');
    });

    it("Resource types test 3.", function () {
        testAPI('TCK/Raml08/ResourceTypes/test3/apiValid.raml');
    });

    it("Resource types test 3. Negative example test.", function () {
        testAPI('TCK/Raml08/ResourceTypes/test3/apiInvalid.raml');
    });

    it("Resource types test 4.", function () {
        testAPI('TCK/Raml08/ResourceTypes/test4/apiValid.raml');
    });

    it("Resource types test 4. Negative example test.", function () {
        testAPI('TCK/Raml08/ResourceTypes/test4/apiInvalid.raml');
    });

    it("Resource types test 5.", function () {
        testAPI('TCK/Raml08/ResourceTypes/test5/apiValid.raml');
    });

    it("Resource types test 5. Negative example test.", function () {
        testAPI('TCK/Raml08/ResourceTypes/test5/apiInvalid.raml');
    });
});

describe('TCK. Traits tests.', function () {
    it("Traits and traits with params 1.", function () {
        testAPI('TCK/RAML10/Traits/test1/apiValid.raml');
    });

    it("Traits and traits with params 1. Negative example test.", function () {
        testAPI('TCK/RAML10/Traits/test1/apiInvalid.raml');
    });

    it("Traits and traits with params 2.", function () {
        testAPI('TCK/RAML10/Traits/test2/apiValid.raml');
    });

    it("Traits and traits with params 2. Negative example test.", function () {
        testAPI('TCK/RAML10/Traits/test2/apiInvalid.raml');
    });

    it("Traits and traits with params 3.", function () {
        testAPI('TCK/RAML10/Traits/test3/apiValid.raml');
    });

    it("Traits and traits params 3. Negative example test.", function () {
        testAPI('TCK/RAML10/Traits/test3/apiInvalid.raml');
    });

    it("Traits and traits with params 4.", function () {
        testAPI('TCK/RAML10/Traits/test4/apiValid.raml');
    });

    it("Traits and traits with params 4. Negative example test.", function () {
        testAPI('TCK/RAML10/Traits/test4/apiInvalid.raml');
    });
});

describe('TCK RAML08. Traits tests.', function () {
    it("Traits and traits with params 1.", function () {
        testAPI('TCK/RAML08/Traits/test1/apiValid.raml');
    });

    it("Traits and traits with params 1. Negative example test.", function () {
        testAPI('TCK/RAML08/Traits/test1/apiInvalid.raml');
    });

    it("Traits and traits with params 2.", function () {
        testAPI('TCK/RAML08/Traits/test2/apiValid.raml');
    });

    it("Traits and traits with params 2. Negative example test.", function () {
        testAPI('TCK/RAML08/Traits/test2/apiInvalid.raml');
    });

    it("Traits and traits with params 3.", function () {
        testAPI('TCK/RAML08/Traits/test3/apiValid.raml');
    });

    it("Traits and traits params 3. Negative example test.", function () {
        testAPI('TCK/RAML08/Traits/test3/apiInvalid.raml');
    });

    it("Traits and traits with params 4.", function () {
        testAPI('TCK/RAML08/Traits/test4/apiValid.raml');
    });

    it("Traits and traits with params 4. Negative example test.", function () {
        testAPI('TCK/RAML08/Traits/test4/apiInvalid.raml');
    });
});

describe('TCK. Annotations tests.', function () {
    it("Annotations test 1.", function () {
        testAPI('TCK/RAML10/Annotations/test1/apiValid.raml');
    });

    it("Annotations test 1. Negative test.", function () {
        testAPI('TCK/RAML10/Annotations/test1/apiInvalid.raml');
    });

    it("Annotations test 2.", function () {
        testAPI('TCK/RAML10/Annotations/test2/apiValid.raml');
    });

    it("Annotations test 2. Negative test.", function () {
        testAPI('TCK/RAML10/Annotations/test2/apiInvalid.raml');
    });

    it("Annotations test 3.", function () {
        testAPI('TCK/RAML10/Annotations/test3/apiValid.raml');
    });

    it("Annotations test 3. Negative test.", function () {
        testAPI('TCK/RAML10/Annotations/test3/apiInvalid.raml');
    });

    it("Annotations test 4.", function () {
        testAPI('TCK/RAML10/Annotations/test4/apiValid.raml');
    });

    it("Annotations test 4. Negative test.", function () {
        testAPI('TCK/RAML10/Annotations/test4/apiInvalid.raml');
    });

    it("Annotations test 5.", function () {
        testAPI('TCK/RAML10/Annotations/test5/apiValid.raml');
    });

    it("Annotations test 5. Negative test.", function () {
        testAPI('TCK/RAML10/Annotations/test5/apiInvalid.raml');
    });

    it("Annotations test 6.", function () {
        testAPI('TCK/RAML10/Annotations/test6/apiValid.raml');
    });

    it("Annotations test 6. Negative test.", function () {
        testAPI('TCK/RAML10/Annotations/test6/apiInvalid.raml');
    });

    it("Annotations test 7.", function () {
        testAPI('TCK/RAML10/Annotations/test7/apiValid.raml');
    });

    it("Annotations test 7. Negative test.", function () {
        testAPI('TCK/RAML10/Annotations/test7/apiInvalid.raml');
    });

    it("Annotations test 8.", function () {
        testAPI('TCK/RAML10/Annotations/test8/apiValid.raml');
    });

    it("Annotations test 8. Negative test.", function () {
        testAPI('TCK/RAML10/Annotations/test8/apiInvalid.raml');
    });

    it("Annotations test 9.", function () {
        testAPI('TCK/RAML10/Annotations/test9/apiValid.raml');
    });

    it("Annotations test 9. Negative test.", function () {
        testAPI('TCK/RAML10/Annotations/test9/apiInvalid.raml');
    });

    it("Annotations test 10.", function () {
        testAPI('TCK/RAML10/Annotations/test10/apiValid.raml');
    });

    it("Annotations test 10. Negative test.", function () {
        testAPI('TCK/RAML10/Annotations/test10/apiInvalid.raml');
    });

    it("Annotations test 11.", function () {
        testAPI('TCK/RAML10/Annotations/test11/apiValid.raml');
    });

    it("Annotations test 11. Negative test.", function () {
        testAPI('TCK/RAML10/Annotations/test11/apiInvalid.raml');
    });

    it("Annotations test 12.", function () {
        testAPI('TCK/RAML10/Annotations/test12/apiValid.raml');
    });

    it("Annotations test 12. Negative test.", function () {
        testAPI('TCK/RAML10/Annotations/test12/apiInvalid.raml');
    });

    it("Annotations test 13.", function () {
        testAPI('TCK/RAML10/Annotations/test13/apiValid.raml');
    });

    it("Annotations test 13. Negative test.", function () {
        testAPI('TCK/RAML10/Annotations/test13/apiInvalid.raml');
    });

    it("Annotations test 14.", function () {
        testAPI('TCK/RAML10/Annotations/test14/apiValid.raml');
    });

    it("Annotations test 14. Negative test.", function () {
        testAPI('TCK/RAML10/Annotations/test14/apiInvalid.raml');
    });

    it("Annotations test 15.", function () {
        testAPI('TCK/RAML10/Annotations/test15/apiValid.raml');
    });

    it("Annotations test 15. Negative test.", function () {
        testAPI('TCK/RAML10/Annotations/test15/apiInvalid.raml');
    });

    it("Annotations test 16.", function () {
        testAPI('TCK/RAML10/Annotations/test16/apiValid.raml');
    });

    it("Annotations test 16. Negative test.", function () {
        testAPI('TCK/RAML10/Annotations/test16/apiInvalid.raml');
    });

    it("Annotations test 17.", function () {
        testAPI('TCK/RAML10/Annotations/test17/apiValid.raml');
    });

    it("Annotations test 17. Negative test.", function () {
        testAPI('TCK/RAML10/Annotations/test17/apiInvalid.raml');
    });

    it("Annotations test 18.", function () {
        testAPI('TCK/RAML10/Annotations/test18/apiValid.raml');
    });

    it("Annotations test 18. Negative test.", function () {
        testAPI('TCK/RAML10/Annotations/test18/apiInvalid.raml');
    });

    it("Annotations test 19.", function () {
        testAPI('TCK/RAML10/Annotations/test19/apiValid.raml');
    });

    it("Annotations test 19. Negative test.", function () {
        testAPI('TCK/RAML10/Annotations/test19/apiInvalid.raml');
    });

    it("Annotations test 20.", function () {
        testAPI('TCK/RAML10/Annotations/test20/apiValid.raml');
    });

    it("Annotations test 20. Negative test.", function () {
        testAPI('TCK/RAML10/Annotations/test20/apiInvalid.raml');
    });

    it("Annotations test 21.", function () {
        testAPI('TCK/RAML10/Annotations/test21/apiValid.raml');
    });

    it("Annotations test 21. Negative test.", function () {
        testAPI('TCK/RAML10/Annotations/test21/apiInvalid.raml');
    });

    it("Annotations test 22.", function () {
        testAPI('TCK/RAML10/Annotations/test22/apiValid.raml');
    });

    it("Annotations test 22. Negative test.", function () {
        testAPI('TCK/RAML10/Annotations/test22/apiInvalid.raml');
    });

    it("Annotations test 23.", function () {
        testAPI('TCK/RAML10/Annotations/test23/apiValid.raml');
    });

    it("Annotations test 23. Negative test.", function () {
        testAPI('TCK/RAML10/Annotations/test23/apiInvalid.raml');
    });

    it("Annotations test 24.", function () {
        testAPI('TCK/RAML10/Annotations/test24/apiValid.raml');
    });

    it("Annotations test 24. Negative test.", function () {
        testAPI('TCK/RAML10/Annotations/test24/apiInvalid.raml');
    });

    it("Annotations test 25.", function () {
        testAPI('TCK/RAML10/Annotations/test25/apiValid.raml');
    });

    it("Annotations test 25. Negative test.", function () {
        testAPI('TCK/RAML10/Annotations/test25/apiInvalid.raml');
    });

    it("Annotations test 26.", function () {
        testAPI('TCK/RAML10/Annotations/test26/apiValid.raml');
    });

    it("Annotations test 26. Negative test.", function () {
        testAPI('TCK/RAML10/Annotations/test26/apiInvalid.raml');
    });
});

describe('TCK. Security Schemes tests.', function () {
    it("Security schemas allowed types.", function () {
        testAPI('TCK/RAML10/SecuritySchemes/test1/apiValid.raml');
    });

    it("Security schemas allowed types. Negative example test.", function () {
        testAPI('TCK/RAML10/SecuritySchemes/test1/apiInvalid.raml');
    });

    it("Described by allowed nodes.", function () {
        testAPI('TCK/RAML10/SecuritySchemes/test2/apiValid.raml');
    });

    it("Described by allowed nodes. Negative example test.", function () {
        testAPI('TCK/RAML10/SecuritySchemes/test2/apiInvalid.raml');
    });

    it("OAuth 1.0 setting required nodes.", function () {
        testAPI('TCK/RAML10/SecuritySchemes/test3/apiValid.raml');
    });

    it("OAuth 1.0 setting required nodes. Negative example test.", function () {
        testAPI('TCK/RAML10/SecuritySchemes/test3/apiInvalid.raml');
    });

    it("OAuth 2.0 setting required nodes.", function () {
        testAPI('TCK/RAML10/SecuritySchemes/test4/apiValid.raml');
    });

    it("OAuth 2.0 setting required nodes. Negative example test.", function () {
        testAPI('TCK/RAML10/SecuritySchemes/test4/apiInvalid.raml');
    });

    it("OAuth 2.0 authorizationGrants allowed items.", function () {
        testAPI('TCK/RAML10/SecuritySchemes/test5/apiValid.raml');
    });

    it("OAuth 2.0 authorizationGrants allowed items. Negative example test.", function () {
        testAPI('TCK/RAML10/SecuritySchemes/test5/apiInvalid.raml');
    });
});

describe('TCK. RAML0.8 Security Schemes tests.', function () {
    it("Security schemas allowed types.", function () {
        testAPI('TCK/RAML08/SecuritySchemes/test1/apiValid.raml');
    });

    it("Security schemas allowed types. Negative example test.", function () {
        testAPI('TCK/RAML08/SecuritySchemes/test1/apiInvalid.raml');
    });

    it("Described by allowed nodes.", function () {
        testAPI('TCK/RAML08/SecuritySchemes/test2/apiValid.raml');
    });

    it("Described by allowed nodes. Negative example test.", function () {
        testAPI('TCK/RAML08/SecuritySchemes/test2/apiInvalid.raml');
    });

    it("OAuth 1.0 setting required nodes.", function () {
        testAPI('TCK/RAML08/SecuritySchemes/test3/apiValid.raml');
    });

    it("OAuth 1.0 setting required nodes. Negative example test.", function () {
        testAPI('TCK/RAML08/SecuritySchemes/test3/apiInvalid.raml');
    });

    it("OAuth 2.0 setting required nodes.", function () {
        testAPI('TCK/RAML08/SecuritySchemes/test4/apiValid.raml');
    });

    it("OAuth 2.0 setting required nodes. Negative example test.", function () {
        testAPI('TCK/RAML08/SecuritySchemes/test4/apiInvalid.raml');
    });
});

describe('TCK tests',function() {

    it("Fragments 001", function () {
        this.timeout(15000);
        testAPI('TCK/RAML10/Fragments 001/fragment.raml');
    });

    it("Types 001", function () {
        this.timeout(15000);
        testAPI('TCK/RAML10/Types 001/api.raml');
    });


    it("Types 002", function () {
        this.timeout(15000);
        testAPI('TCK/RAML10/Types 002/api.raml');
    });

    it("Types 003", function () {
        this.timeout(15000);
        testAPI('TCK/RAML10/Types 003/api.raml');
    });

    it("Trait 001", function () {
        this.timeout(15000);
        testAPI('TCK/RAML10/Traits/Trait 001/api.raml');
    });

    it("Trait 002", function () {
        this.timeout(15000);
        testAPI('TCK/RAML10/Traits/Trait 002/api.raml');
    });

    it("Annotations 001", function () {
        this.timeout(15000);
        testAPI('TCK/RAML10/Annotations 001/api.raml');
    });

    it("Annotations 002", function () {
        this.timeout(15000);
        testAPI('TCK/RAML10/Annotations 002/api.raml');
    });

    it("Annotations 003", function () {
        this.timeout(15000);
        testAPI('TCK/RAML10/Annotations 003/api.raml');
    });

    it("Bodies 001", function () {
        this.timeout(15000);
        testAPI('TCK/RAML10/Bodies/Body 001/api.raml');
    });

    it("Instagram 1.0", function () {
        this.timeout(15000);
        testAPI('../example-ramls/Instagram1.0/api.raml',null,'TCK/RAML10/Instagram1.0/api-tck.json');
    });

    it("Instagram 0.8", function () {
        this.timeout(15000);
        testAPI('../example-ramls/Instagram/api.raml',null,'TCK/RAML08/Instagram/api-tck.json');
    });

    it("Libraries 001", function () {
        this.timeout(15000);
        testAPI('TCK/RAML10/Libraries 001/api.raml');
    });

    it("Form Parameters", function () {
        this.timeout(15000);
        testAPI('TCK/RAML08/Form Parameters/api.raml');
    });


    it("Overlays 001", function () {
        this.timeout(15000);
        testAPI("TCK/RAML10/Overlays 001/apigateway.raml", [
            "TCK/RAML10/Overlays 001/apigateway-aws-overlay.raml"
        ]);
    });

    it("Overlays 002", function () {
        this.timeout(15000);
        testAPI("TCK/RAML10/Overlays 002/api.raml", [
            "TCK/RAML10/Overlays 002/overlay.raml"
        ]);
    });

    it("Overlays 003", function () {
        this.timeout(15000);
        testAPI("TCK/RAML10/Overlays 003/api.raml", [
            "TCK/RAML10/Overlays 003/overlay.raml"
        ]);
    });

    it("Extension example", function () {
        this.timeout(15000);
        testAPI("TCK/RAML10/examples/raml1/overlays&extensions/extension/master.raml", [
            "TCK/RAML10/examples/raml1/overlays&extensions/extension/extension.raml"
        ],"TCK/RAML10/examples/raml1/overlays&extensions/extension/master-tck.json");
    });

    it("Overlay example", function () {
        this.timeout(15000);
        testAPI("TCK/RAML10/examples/raml1/overlays&extensions/overlay/master.raml", [
            "TCK/RAML10/examples/raml1/overlays&extensions/overlay/slave.raml"
        ],"TCK/RAML10/examples/raml1/overlays&extensions/overlay/master-tck.json");
    })
});

function testAPI(apiPath, extensions, tckJsonPath) {
    if (extensions) {
        extensions = extensions.map(function (x) { return data(x); });
    }
    var api = parserAPI.loadRAMLSync(data(apiPath), extensions);
    var expanded = api["expand"] ? api["expand"]() : api;
    expanded.setAttributeDefaults(true);
    var json = expanded.toJSON({ rootNodeDetails: true });
    if (!tckJsonPath) {
        var dir = path.dirname(data(apiPath));
        var fileName = path.basename(apiPath).replace(".raml", "-tck.json");
        tckJsonPath = path.resolve(dir, fileName);
    }
    if (!fs.existsSync(data(tckJsonPath))) {
        fs.writeFileSync(data(tckJsonPath), JSON.stringify(json, null, 2));
    }
    var tckJson = JSON.parse(fs.readFileSync(data(tckJsonPath)).toString());
    var regExp = new RegExp('/errors\\[\\d+\\]/path');
    var diff = compare(json, tckJson).filter(function (x) { return !x.path.match(regExp); });
    if (diff.length == 0) {
        assert(true);
    }
    else {
        console.log(diff.map(function (x) { return x.message("actual", "expected"); }).join("\n\n"));
        assert(false);
    }
}

function compare(arg0, arg1, path) {
    if (path === void 0) { path = ''; }
    var diffs = [];
    if (arg0 == null) {
        if (arg1 != null) {
            diffs.push(new Diff(path, arg0, arg1, 'Defined/undefined mismatch'));
            return diffs;
        }
    }
    else if (arg1 == null) {
        diffs.push(new Diff(path, arg0, arg1, 'Defined/undefined mismatch'));
        return diffs;
    }
    else if (Array.isArray(arg0)) {
        if (!Array.isArray(arg1)) {
            diffs.push(new Diff(path, arg0, arg1, 'Array/' + typeof (arg1) + ' mismatch'));
            return diffs;
        }
        else {
            var l0 = arg0.length;
            var l1 = arg1.length;
            if (l1 != l0) {
                diffs.push(new Diff(path, arg0, arg1, 'Array lengths mismatch'));
                return diffs;
            }
            var l = Math.min(l0, l1);
            for (var i = 0; i < l; i++) {
                diffs = diffs.concat(compare(arg0[i], arg1[i], path + '[' + i + ']'));
            }
        }
    }
    else if (arg0 instanceof Object) {
        if (!(arg1 instanceof Object)) {
            diffs.push(new Diff(path, arg0, arg1, 'Object/' + typeof (arg1) + ' mismatch'));
            return diffs;
        }
        else {
            var keys0 = Object.keys(arg0);
            var keys1 = Object.keys(arg1);
            var map = {};
            for (var i = 0; i < keys0.length; i++) {
                var key = keys0[i];
                map[key] = true;
                var val0 = arg0[key];
                var val1 = arg1[key];
                diffs = diffs.concat(compare(val0, val1, path + '/' + key));
            }
            for (var i = 0; i < keys1.length; i++) {
                var key = keys1[i];
                if (map[key]) {
                    continue;
                }
                var val0 = arg0[key];
                var val1 = arg1[key];
                diffs = diffs.concat(compare(val0, val1, path + '/' + key));
            }
        }
    }
    else {
        if (arg0 !== arg1) {
            diffs.push(new Diff(path, arg0, arg1, 'Inequal values'));
        }
    }
    return diffs;
}

function data(filepath) {
    var datadir =  path.resolve(__dirname, '../../');

    return path.resolve(datadir, filepath);
}