const {Flag} = require("../modules/Flag");
const {ShortText} = require("../modules/ShortText");
const {DataTypes} = require("../modules/Schema");
const {isEmpty} = require("../modules/Utils")


const isObject = (value) => {
    return typeof value === 'object' && value !== null && value.constructor === Object
}

const isRule = (value) => {
    return value.type && value.type.name && DataTypes[value.type.name]
    
}

const isSchema = (value) => {
    return isObject(value) && !isRule(value)
}

const isArray = (value) => {
    return Array.isArray(value)
}

class Schema {
    definition;
    constructor(definition){
        this.definition = definition;
    }

    #testField = (field, rules, partialDoc = false) => {
    

        let sanitised = "";
        let errors = [];
    
        if(!field && rules.default){
            field = rules.default;
        }
    
        if(!field && rules.required && !partialDoc){
            errors = "REQUIRED_FIELD";
        }
    
        if(field){
            const fieldValidation = rules.type.test(field)
    
            if(fieldValidation.valid){
                sanitised = fieldValidation.sanitised
            } else {
                errors = fieldValidation.errors
            }
        }
    
        const valid = isEmpty(errors);
    
        if(!valid){
            sanitised = null
        }
    
        return {
            valid,
            errors,
            sanitised
        }
    }

    #traverse({doc, definition = this.definition, partialDoc = false}){

        let sanitised = {};
        const errors = {};
        let childResult;
        let fieldResult;

        if(isArray(definition)){
            // DEFINITION IS AN ARRAY
            sanitised = [];
            const childDefinition = definition[0];

            doc.forEach((childDoc, index) => {
                console.log(childDoc);
                childResult = this.#traverse({doc: childDoc, definition: childDefinition, partialDoc});
                if(childResult.valid){
                    sanitised.push(childResult.sanitised);
                } else {
                    errors[index] = childResult.errors;
                }
            })

        } else {
            // DEFINITION IS AN OBJECT
            Object.entries(definition).forEach(([key, value]) => {
                if(isRule(value)){
                    // FIELD
                    fieldResult = this.#testField(doc[key], value, partialDoc);
                    if(fieldResult.valid){
                        sanitised[key] = fieldResult.sanitised;
                    } else {
                        errors[key] = fieldResult.errors;
                    }

                } else if(isSchema(value)){
                    childResult = this.#traverse({doc: doc[key], definition:value, partialDoc});
                    if(childResult.valid){
                        sanitised[key] = childResult.sanitised;
                    } else {
                        errors[key] = childResult.errors;
                    }


                } else if(isObject(value)){
                    // ???

                } else if(isArray(value)) {
                    if(isRule(value[0])){
                        doc[key].forEach((docElement, index) => {
                            
                            fieldResult = this.#testField(docElement, value[0], partialDoc);
                            if(fieldResult.valid){
                                sanitised[key] = fieldResult.sanitised;
                            } else {
                                errors[key] = fieldResult.errors;
                            }
        
                        })
                    } else {
                        sanitised[key] = [];
                        
                        doc[key].forEach((docElement, index) => {
                            
                            childResult = this.#traverse({doc: docElement, definition: value[0], partialDoc});
                            if(childResult.valid){
                                sanitised[key].push(childResult.sanitised);
                            } else {
                                if(!errors[key]){
                                    errors[key] = {}
                                }
                                errors[key][index] = childResult.errors;
                            }
                        })
                    }
                    
                   
                    
                }
            })
        }

        const valid = isEmpty(errors);

        if(!valid){
            sanitised = null
        }

        return {
            valid,
            errors,
            sanitised
        }
    }

    validate(document){
        const {valid, sanitised, errors} = this.#traverse({doc: document});

        return {valid, sanitised, errors};
    }

    validatePartial(document){
        const {valid, sanitised, errors} = this.#traverse({doc: document, partialDoc: true});

        return {valid, sanitised, errors};
    }

    get stringified(){
        return JSON.stringify(this.serialised)
    }

    get pretty(){
        return JSON.stringify(this.serialised, null, 4)
    }

    get serialised(){
        return Schema.serialise(this.definition);
    }

    static serialise(definition){
        const serialised = (isArray(definition)) ? [] : {};

        Object.entries(definition).forEach(([field, rules]) => {

            if(isArray(definition[field])){
                serialised[field] = [...rules]
                
            } else if(isRule(rules)){
                serialised[field] = {...rules}
                serialised[field].type = rules.type.name;

            } else if(isSchema(rules)){
                serialised[field] = Schema.serialise(rules)
            }
            
            if(isArray(rules)) {
                serialised[field] = [];
                serialised[field] = Schema.serialise(rules)
            }
        })

        return serialised;
    }

    static parse(schema, {isStringified = true} = {}){
        const parsed = (isStringified) ? JSON.parse(schema) : schema;

        Object.entries(parsed).forEach(([field, rules]) => {

            if(rules.type && DataTypes[rules.type]){
                rules.type = DataTypes[rules.type]
            } else if(isObject(rules)) {
                parsed[field] = Schema.parse(parsed[field], {isStringified: false})
            } else if(isArray(rules)){
                if(rules[0].type && DataTypes[rules[0].type]){
                    parsed[field] = Schema.parse(parsed[field], {isStringified: false})
                } else {
                    parsed[field] = Schema.parse(parsed[field], {isStringified: false})
                }
            }
            
        })

        return parsed;
    }
}

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
        "meta": [ // Array of Object
            { // JSON Object of fields
                key: {type:ShortText},
                value: {type:ShortText}
            }
        ],
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
                    type:ShortText, required: true
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
    console.log(parsed.slots);
    console.groupEnd();
}

{
    //const {valid, errors, sanitised} = schema.validatePartial(testDataPartial);
    //console.log(JSON.stringify(sanitised, null, 4))

    
}


















