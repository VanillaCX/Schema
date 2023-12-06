const {DataType} = require("../DataType");

class ShortText extends DataType {
    static name = "ShortText";
    constructor(){}

    static #minLength = 0;
    static #maxLength = 255;
    static #allowBasicHTML = false;
    
    static test(value, {
        minLength = this.#minLength,
        maxLength = this.#maxLength
    } = {}){
        
        const errors = [];

        if(typeof value === "number"){
            value = value.toString();
        }

        if(typeof value === "string"){
            value = this.stripHTML(value);

        } else {
            errors.push("TYPE_MISMATCH")
        
        }
        
        if(value.length < minLength){
            errors.push("TOO_SHORT")
        }
        
        if(value.length > maxLength){
            errors.push("TOO_LONG")
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

module.exports = { ShortText }