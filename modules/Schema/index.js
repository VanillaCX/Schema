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

class Schema {
    definition;

    constructor(definition = {}){
        this.definition = definition;
    }

    validatePartial(document){
        const {
            valid,
            errors,
            sanitised
        } = this.validateDoc(document, true);

        return {
            valid, errors, sanitised
        }
    }

    validateDoc(document, partialDoc = false){

        let sanitised = {};
        const errors = {};

        Object.entries(this.definition).forEach(([field, rules]) => {

            if(Array.isArray(rules)){
                rules = rules[0];

                if(document[field]){
                    document[field].forEach((docField, index) => {
                        if(rules.schema){
                            const childSchema = rules.schema.validateDoc(docField, partialDoc)
        
                            if(childSchema.valid){
                                if(!sanitised[field]){
                                    sanitised[field] = []
                                }
                                sanitised[field].push(childSchema.sanitised);
    
                            } else {
                                if(!errors[field]){
                                    errors[field] = {}
                                }
                                errors[field][index] = childSchema.errors
    
                            }
                        }
    
                        if(rules.type && DataTypes[rules.type.name]){
                            const fieldValidation = rules.type.test(docField)
        
                            if(fieldValidation.valid){
                                if(!sanitised[field]){
                                    sanitised[field] = []
                                }
                                sanitised[field].push(fieldValidation.sanitised)
                            } else {
                                if(!errors[field]){
                                    errors[field] = {}
                                }
                                errors[field][index] = fieldValidation.errors
                            }
                        }
                    });
                }

                
                  

                
            } else {
                if(!document[field] && rules.default){
                    document[field] = rules.default;
                }
    
                if(!document[field] && rules.required && !partialDoc){
                    
                    errors[field] = "REQUIRED_FIELD";
    
                    return;
                }
    
                if(document[field]){
    
                    if(rules.schema){
                        const childSchema = rules.schema.validateDoc(document[field], partialDoc)
    
                        if(childSchema.valid){
                            sanitised[field] = childSchema.sanitised
                        } else {
                            errors[field] = childSchema.errors
                        }
                    }
        
                    if(rules.type && DataTypes[rules.type.name]){
                        const fieldValidation = rules.type.test(document[field])
    
                        if(fieldValidation.valid){
                            sanitised[field] = fieldValidation.sanitised
                        } else {
                            errors[field] = fieldValidation.errors
                        }
                    }
                    
    
                }
            }
            
        })

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
        /**
         * PROBLEM: default: Squid.generate() is actually executing the method opposed to just wrapping it in quotes
         */
        const serialised = {};

        Object.entries(definition).forEach(([field, rules]) => {
            serialised[field] = {...rules}

            if(rules.schema){
                serialised[field].schema = rules.schema.serialised
            }

            if(rules.type && DataTypes[rules.type.name]){
                serialised[field].type = rules.type.name;
            }
        })

        return serialised;
    }

    static parse(schema, {alreadyStringified = false} = {}){
        const parsed = (alreadyStringified) ? schema : JSON.parse(schema);

        Object.entries(parsed).forEach(([field, rules]) => {
            if(rules.type && DataTypes[rules.type]){
                rules.type = DataTypes[rules.type]
            }

            if(rules.schema){
                rules.schema = Schema.parse(rules.schema, {alreadyStringified: true})
            }
        })

        return parsed;
    }
}


module.exports = { Schema, DataTypes, SchemaError }