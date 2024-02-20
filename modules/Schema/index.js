const { isEmpty } = require("../Utils");

const {Identifier} = require("../Identifier");
const {ShortText} = require("../ShortText");
const {LongText} = require("../LongText");
const {Email} = require("../Email");
const {Url} = require("../Url");
const {Password} = require("../Password");
const {Stamp} = require("../Stamp");
const {EventLogger} = require("../EventLogger");
const {Squid} = require("../Squid");
const {NameSpace} = require("../NameSpace");
const {PhoneNumber} = require("../PhoneNumber");
const {SchemaError} = require("../SchemaError");
const {Flag} = require("../Flag");

const DataTypes = {
    Identifier,
    ShortText,
    LongText,
    Email,
    Url,
    Password,
    Stamp,
    EventLogger,
    Squid,
    NameSpace,
    PhoneNumber,
    Flag
}

const isSchema = (value) => {
     return value.name === "Schema"
}

const isObject = (value) => {
    return typeof value === 'object' && value !== null && value.constructor === Object
}

const isRule = (value) => {
    return value.type && value.type.name && DataTypes[value.type.name]
    
}

const isJsonObject = (value) => {
    return isObject(value) && !isRule(value)
}

const isArray = (value) => {
    return Array.isArray(value)
}

class Schema {
    name = "Schema"
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

        if(field && !rules.schema){
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
            if(isRule(childDefinition)){
                doc.forEach((childDoc, index) => {
                    fieldResult = this.#testField(childDoc, childDefinition, partialDoc);
                    if(fieldResult.valid){
                        sanitised.push(fieldResult.sanitised);
                    } else {
                        errors[index] = fieldResult.errors;
                    }
                })
            } else {
                doc.forEach((childDoc, index) => {
                    childResult = this.#traverse({doc: childDoc, definition: childDefinition, partialDoc});
                    if(childResult.valid){
                        sanitised.push(childResult.sanitised);
                    } else {
                        errors[index] = childResult.errors;
                    }
                })
            }
            

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
                    sanitised = [];

                    fieldResult = this.#testField(doc, definition, partialDoc);

                    if(fieldResult.valid){
                        
                        if (isArray(doc)) {

                            for (const [childKey, childDoc] of doc.entries()) {
                                childResult = this.#traverse({doc: childDoc, definition:value.definition[0], partialDoc});
                                if (childResult.valid) {
                                    sanitised.push(childResult.sanitised);
                                } else {
                                    errors[childKey] = childResult.errors;
                                }
                            }
                        } else {
                            childResult = this.#traverse({doc: doc[key], definition:value.definition, partialDoc});
                            if(childResult.valid){
                                sanitised[key] = childResult.sanitised;
                            } else {
                                errors[key] = childResult.errors;
                            }
                        }

                    } else {
                        errors[key] = fieldResult.errors;
                    }

                    

                    

                } else if(isJsonObject(value)){
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
                                if(!sanitised[key]){
                                    sanitised[key] = []
                                }
                                sanitised[key].push(fieldResult.sanitised);
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

    get schema(){
        return this.definition;
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

            } else if(isJsonObject(rules)){
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


module.exports = { Schema, DataTypes, SchemaError }