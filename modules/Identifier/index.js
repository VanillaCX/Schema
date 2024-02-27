const crypto = require("node:crypto");

const {DataType} = require("../DataType");
const {ErrorType, ErrorSyntax, ErrorTooLong, ErrorTooShort} = require("@VanillaCX/Errors")

class Identifier extends DataType {
    static name = "Identifier";
    static #minLength = 3;
    static #maxLength = 100;
    static #reservedWords = ["matter", "edition", "slot", "model", "editor", "user", "cx"];
    static #syntax = /^([a-z][a-z0-9_-]+[a-z])$/;

    static generate = (prefix) => {
        let random = crypto.randomUUID();
    
        random = random.replace(/-/g, "")
        
        if(typeof prefix === "string" && prefix.length > 0){
            random = `${prefix}-${random}`
        }
    
        return random;
    }

    static test(value){
        const errors = [];

        if(typeof value === "number"){
            value = value.toString();
        }

        if(typeof value === "string"){
            value = this.stripHTML(value);
            value = value.toLowerCase();

        } else {
            errors.push(ErrorType.code)
        
        }
        
        if(value.length < this.#minLength){
            errors.push(ErrorTooShort.code)
        }
        
        if(value.length > this.#maxLength){
            errors.push(ErrorTooLong.code)
        }

        if(!this.#syntax.test(value)){
            errors.push(ErrorSyntax.code)
        }

        if(this.#reservedWords.indexOf(value) > -1){
            errors.push("RESERVED_WORD");
        }
       
        const valid = (errors.length === 0);
        const sanitised = (valid) ? value : null;
        
        return {
            valid,
            errors,
            sanitised
        };
    }

    constructor(value){
        super()
        this.value = value
    }

    test(){
        return Identifier.test(this.value)
    }
}

module.exports = { Identifier }
