# SchemaCX Package
## Installation
#### Install Package
       $ npm install

## Test Script
Make sure you have installed the package (See [Installation](#Installation)).

    $ npm run test
    
## Examples
    // Import Package
    const {Schema, ShortText, LongText} = require("@VanillaCX/SchemaCX");

    // Create a MongoDB client
    const mySchema = new Schema({
        title: {type: ShortText, required: true},
        subtitle: {type: ShortText, required: true},
        description: {type: LongText, required: true}
    });
    
### Validate a document
    const myDocument = {
        title: "Lee",
        subtitle: "Bowyer",
        description: "Getting there little by Little",
        willberemoved: true
    }

    const {valid, errors, sanitised} = mySchema.validateDoc(myDocument)

### Validate a partial document
    const myDocument = {
        title: "Lee"
    }

    const {valid, errors, sanitised} = mySchema.validatePartial(myDocument);

### Stringify Schema to save to DataBase
    const stringifiedSchema = mySchema.stringified;

### Parse stringified schema
    const stringifiedSchema = mySchema.stringified;
    const parsedSchema = Schema.parse(stringifiedSchema);