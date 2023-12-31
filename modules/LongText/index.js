const {DataType} = require("../DataType");

class LongText extends DataType {
    static name = "LongText";
    constructor(){}
    
    static #minLength = 0;
    static #maxLength = 50000;
    
    static test(value, {
        minLength = this.#minLength,
        maxLength = this.#maxLength
    } = {}){
        const errors = [];
        value = this.stripHTML(value);
        
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


module.exports = { LongText }