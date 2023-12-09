const {Flag} = require("../modules/Flag");
const {ShortText} = require("../modules/ShortText");
const {DataTypes, Schema} = require("../modules/Schema");
const {isEmpty} = require("../modules/Utils")

const meta = new Schema([ // Array of Object
{ // JSON Object of fields
    key: {type:ShortText},
    value: {type:ShortText}
}
])


const schema = new Schema(
    {
        "id": { // Field
            type: ShortText, required: true
        },
        "label": { // Field
            type:ShortText
        },
        "model": { // Field
            type:ShortText
        },
        "meta": meta,
        "taxonomy": { // JSON Object
            "tags": [ // Array of Field
                { // Field
                    type: ShortText, min: 3, max: 10
                }
            ],
            "categories": [ // Array of Field
                { // Field
                    type: ShortText, max: 10
                },
            ],
        },
        "slots": [ // Array of object
            { // JSON Object of fields
                "label": { // Field
                    type:Flag, required: true
                },
                "edition": { // Field
                    type:ShortText
                },
                "default": { // Field
                    type:ShortText
                },
            }
        ]
    }
);


const testData = {
    "id": "M-001",
    "label": "Paul",
    "model": "model-001",
    "meta": [
        {
            "key": "user-defined-1",
            "value": "meta-data-1"
        }
    ],
    "taxonomy": {
        "tags": ["user-assigned-4"],
        "categories": ["user-assigned-4", "user-assigned-5"]
    },
    "slots": [
        {
            "label": "Default",
            "edition": "E-001",
            "default": "true"
        },{
            "label": "Default",
            "edition": "E-002"
        },{
            "label": "Default",
            "label": "Birthday Edition",
            "edition": "E-003"
        }
    ]
}

const testDataPartial = {
    "label": "Paul",
    "model": "model-001",
    "meta": [
        {
            "key": "user-defined-1",
            "value": "meta-data-1"
        }
    ],
    "taxonomy": {
        "tags": ["user-assigned-4"],
        "categories": ["user-assigned-4", "user-assigned-5"]
    },
    "slots": [
        {
            "edition": "E-001",
            "default": "true"
        },{
            "edition": "E-002"
        },{
            "label": "Birthday Edition",
            "edition": "E-003"
        }
    ]
}




{
    const {valid, errors, sanitised} = schema.validate(testData);
    //console.log(JSON.stringify(sanitised, null, 4))

    console.log(schema.serialised);
    const parsed = Schema.parse(schema.stringified);
    console.group("\nparsed")
    console.log(parsed);
    console.groupEnd();

    console.group("\nparsed.meta")
    console.log(parsed.meta);
    console.groupEnd();

    console.group("\nparsed.taxonomy")
    console.log(parsed.taxonomy);
    console.groupEnd();

    console.group("\nparsed.slots")
    console.log(parsed.slots[0]);
    console.groupEnd();
}

{
    //const {valid, errors, sanitised} = schema.validatePartial(testDataPartial);
    //console.log(JSON.stringify(sanitised, null, 4))

    
}


















