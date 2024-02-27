const {DataType} = require("../DataType");
const {ErrorSyntax, ErrorTooLong, ErrorTooShort} = require("@VanillaCX/Errors")

class Url extends DataType {
    static name = "Url";

    constructor(value){
        super()
        this.value = value
    }
    
    static #minLength = 5;
    static #maxLength = 255;
    static #httpsOnly = true;
    static #syntax = /^http(s)?:\/\/[a-zA-Z0-9.-@]+.[a-zA-Z]{2}$/;
       
    static test(value){
        const errors = [];
        value = this.stripHTML(value);
        
        if(value.length < this.#minLength){
            errors.push(ErrorTooShort.code)
        }
        
        if(value.length > this.#maxLength){
            errors.push(ErrorTooLong.code)
        }

        if(this.#httpsOnly && value.substring(0, 8) !== "https://"){
            errors.push("MUST_USE_HTTPS")
        }
        
        if(!this.#syntax.test(value)){
            errors.push(ErrorSyntax.code)
        }
        
        const valid = (errors.length === 0);
        const sanitised = (valid) ? value : null;
        
        return {
            valid,
            errors,
            sanitised
        };
    }

    test(){
        return Url.test(this.value)
    }
    
}




module.exports = { Url }