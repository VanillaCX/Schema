const {ErrorMissing} = require("@VanillaCX/Errors")

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
    constructor({definition, required = false} = {}){
        this.definition = definition
        this.required = required
        this.type = Schema
    }

    static parse(stringifiedJSON){
        return JSON.parse(stringifiedJSON, (key, value) => {
            if (key === "type") {
                // Doubling the age value
                return DataTypes[value]
            }
            return value;
        })
    }

    toString(){
        // Using replacer function to replace value of type (which is class / object) with its name (value.name)
        return JSON.stringify(this, (key, value) => {
            if (key == "type") {
                return value.name
            } 

            return value
        })
    }

    isSchema(value){
        return (value && value.type && value.type.name == "Schema") ? true : false
    }

    isRule(value) {
        return (value && value.type && value.type.name) ? true : false
    }

    isList(value) {
        return Array.isArray(value)
    }

    #test(schema, document){
        let sanitised = {}
        let errors = {}
        let valid = true

        for (const [key, value] of Object.entries(schema.definition)){

            

            if(this.isSchema(value)){

                /**
                 * SCHEMA: LIST-BASED DEFINITION
                 */
                if (this.isList(value.definition)) {
                    // Defintiion is a list

                    const listRuleSet = value.definition[0]
                    const listRequired = value.required
                    const list = document[key] || []


                    if(listRequired && list.length == 0){
                        errors[key] = ErrorMissing.code
                    } else {
                        for(const entry of list){
                            const listEntryResult = this.#test({definition: listRuleSet}, entry)
                            
                            if (listEntryResult.valid == false) {
                                if (!errors[key]) {
                                    errors[key] = []
                                }
                                errors[key].push(listEntryResult.errors)
                            } else {
                                if (!sanitised[key]) {
                                    sanitised[key] = []
                                }
                                sanitised[key].push(listEntryResult.sanitised)
                            }
                        }
                    }

                /**
                 * SCHEMA: OBJECT-BASED DEFINITION
                 */
                } else {
                    const childSchemaResults = this.#test(value, document[key])

                    if (childSchemaResults.valid == false) {
                        errors[key] = childSchemaResults.errors
                    } else {
                        sanitised[key] = childSchemaResults.sanitised
                    }
                }

                
            /**
             * RULE: SINGLE
             */
            } else if (this.isRule(value)) {
                if(!document || !document[key]) {
                    if (value.required) {
                        errors[key] = ErrorMissing.code
                    }
                } else {
                    const ruleResults = value.type.test(document[key])

                    if (ruleResults.valid == false) {
                        errors[key] = ruleResults.errors
                    } else {
                        sanitised[key] = ruleResults.sanitised
                    }
                }


                

            /**
             * RULE: LIST OF RULES
             */
            } else if (this.isList(value) && this.isRule(value[0])) {

                    const rule = value[0];
                    const list = document[key] || [];

                    if(rule.required && list.length == 0){
                        errors[key] = ErrorMissing.code
                    } else {
                        for(const entry of list){

                            const ruleResults = rule.type.test(entry)

                            if (ruleResults.valid == false) {
                                if (!errors[key]) {
                                    errors[key] = []
                                }
                                errors[key].push(ruleResults.errors)
                            } else {
                                if (!sanitised[key]) {
                                    sanitised[key] = []
                                }
                                sanitised[key].push(ruleResults.sanitised)
                            }
                        }
                    }

                    


            }
        }

        // Check if meets required requirements
        if (schema.required && Object.keys(schema.definition).length == 0) {
            errors["BASE"] = ErrorMissing.code
        }

        // Invalid document
        if ((Object.keys(errors).length > 0)) {
            valid = false;
            sanitised = {}
        }

        return {
            valid,
            sanitised,
            errors
        }
    }

    test(document){
        const result = this.#test(this, document)

        return result
    }
}

module.exports = { Schema, DataTypes }