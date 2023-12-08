const {DataType} = require("../DataType");
const {crypto} = require("node/crypto");

class Identifier extends DataType {
    static name = "Identifier";
    constructor(){}

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
            errors.push("TYPE_MISMATCH")
        
        }
        
        if(value.length < this.#minLength){
            errors.push("TOO_SHORT")
        }
        
        if(value.length > this.#maxLength){
            errors.push("TOO_LONG")
        }

        if(!this.#syntax.test(value)){
            errors.push("SYNTAX_ERROR")
        }

        if(this.#reservedWords.indexOf(value).length > -1){
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
}

module.exports = { Identifier }
