const {Schema, LongText} = require("../index.js");
const { ShortText } = require("../index.js");

const ProjectSchema = new Schema({
    title: {type: ShortText, required: true},
    subtitle: {type: ShortText, required: true},
    description: {type: LongText, required: true}
})

{
    const { valid, errors, sanitised} = ProjectSchema.validateDoc({
        title: "Lee",
        subtitle: "Bowyer",
        description: "Getting there little by Little",
        willberemoved: true
    })
    
    console.log("Valid: ", valid);
    console.log("Errors", errors);
    console.log("sanitised:", sanitised);
}



{
    const { valid, errors, sanitised} = ProjectSchema.validatePartial({
        title: "Lee",
    })
    
    console.log("Valid: ", valid);
    console.log("Errors", errors);
    console.log("sanitised:", sanitised);
}



const stringifiedSchema = ProjectSchema.stringified; // Save to DB
console.log("stringifiedSchema:", stringifiedSchema);

const parsedFromStringified = Schema.parse(stringifiedSchema);
console.log("parsedFromStringified:", parsedFromStringified);