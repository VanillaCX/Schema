const {Schema, LongText} = require("../index.js");
const { ShortText } = require("../index.js");




const meta = new Schema([ // LIST
    { // OBJECT
        key: {type: ShortText, required: true},
        value: {type: ShortText, required: true},
    }
])

const taxonomy = new Schema({
    tags: [{type:ShortText}],
    categories: [{type:ShortText}],
});

const schema = new Schema({
    id: {type: ShortText, required: true},
    label: {type: ShortText, required: true},
    model: {type: ShortText, required: true},
    meta: {schema: meta, required: true},
    taxonomy: {schema: taxonomy, required: true},
})

const {valid, errors, sanitised} = schema.validate({
    id: "M-001",
    label: "Paul",
    model: "model-001",
    meta: [
        {
            key: "user-defined-1",
            value: "meta-data-1"
        },{
            key: "user-defined-1",
            value: "meta-data-1"
        }
    ],
    taxonomy: {
        tags: ["user-assigned-4"],
        categories: ["user-assigned-4", "user-assigned-5"]
    }
});

console.log({valid, errors, sanitised});
console.log(JSON.stringify(sanitised, null, 4));


/*

{
    const asObject = new Schema(
        { // OBJECT
            createdBy: {type: ShortText, required: true},
            creationDate: {type: ShortText, required: true},
        }
    )
    
    const {valid, errors, sanitised} = asObject.validate({
        createdBy: "Lee",
        creationDate: "31st January"
    });

    console.log({valid, errors, sanitised});

}




{
    const asArray = new Schema(
        [ // LIST
            { // OBJECT
                key: {type: ShortText, required: true},
                value: {type: ShortText, required: true},
            }
        ]
    )
    
    const {valid, errors, sanitised} = asArray.validate([
        {
            key: "color",
            value: "red"
        },{
            key: "size",
            value: "big"
        }
    ])

    console.log({valid, errors, sanitised});

}



{
    const asObject = new Schema(
        { // OBJECT
            createdBy: {type: ShortText, required: true},
            creationDate: {type: ShortText, required: true},
        }
    )
    
    const {valid, errors, sanitised} = asObject.validate({
        createdBy: "Lee",
        creationDate: "31st January"
    });

    console.log({valid, errors, sanitised});

}

*/


