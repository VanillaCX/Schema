const {DataType} = require("../DataType");

class Url extends DataType {
    static name = "Url";

    constructor(value){
        super()
        this.value = value
    }

    validate(){
        return Url.validate(this.value)
    }
    
    static #minLength = 5;
    static #maxLength = 255;
    static #httpsOnly = true;
    static #syntax = /^http(s)?:\/\/[a-zA-Z0-9.-@]+.[a-zA-Z]{2}$/;
       
    static validate(value, {
        syntax = this.#syntax,
        httpsOnly = this.#httpsOnly,
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

        if(httpsOnly && value.substring(0, 8) !== "https://"){
            errors.push("MUST_USE_HTTPS")
        }
        
        if(!syntax.test(value)){
            errors.push("SYNTAX_ERROR")
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




module.exports = { Url }