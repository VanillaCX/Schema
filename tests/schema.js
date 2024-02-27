const {Schema, ShortText} = require("../index.js")

const subSchema = new Schema({
    definition: {
        day: {type: ShortText, required: true},
        month: {type: ShortText, required: true},
        year: {type: ShortText, required: true}
    },
    required: true
})



const metaSchema2 = new Schema({
    definition: [{
        key: {type: ShortText, required: true},
        value: {type: ShortText, required: true}
    }],
    required: true
})



const originalSchema = new Schema({
    definition: {
        title: {type: ShortText, required: true},
        subtitle: {type: ShortText, required: true},
        list: [{type: ShortText, required: true}],
        meta2: metaSchema2,
        dob: subSchema
    },
    required: true
})

const document = {
    title: "Lee",
    subtitle: "Bowyer",
    list: ["One", "Two"],
    meta2: [{
        key: "THREE",
        value: "FOURS"
    },{
        key: "FIVES",
        value: "SIXES"
    }],
    dob: {
        day: "31",
        month: "Jan",
        year: "1979",
    }
}

stringified = originalSchema.toString()
parsed = Schema.parse(stringified)

const {valid, sanitised, errors} = originalSchema.test(document)

console.log(valid)
console.log(sanitised)
console.log(errors)