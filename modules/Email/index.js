const {DataType} = require("../DataType");
const {ErrorTooLong, ErrorTooShort, ErrorSyntax} = require("@VanillaCX/Errors")

class Email extends DataType{
    constructor(value){
        super(value)
    }

    static name = "Email"

    static #minLength = 5;
    static #maxLength = 255;
    static #syntax = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    static test(value){
        const errors = []
        value = this.stripHTML(value);

        if(value.length < this.#minLength){
            errors.push(ErrorTooShort.code)
        }
        
        if(value.length > this.#maxLength){
            errors.push(ErrorTooLong.code)
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
        return Email.test(this.value)
    }
    
}



module.exports = { Email }