const {DataType} = require("../DataType");
const {ErrorType, ErrorTooLong, ErrorTooShort} = require("@VanillaCX/Errors")


class PhoneNumber extends DataType {
    static name = "PhoneNumber";
    static #minLength = 0;
    static #maxLength = 255;
    
    static test(value){
        
        const errors = [];
        value = this.stripHTML(value);
        
        if(value.length < this.#minLength){
            errors.push(ErrorTooShort.code)
        }
        
        if(value.length > this.#maxLength){
            errors.push(ErrorTooLong.code)
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
        return PhoneNumber.test(this.value)
    }
    
}






module.exports = { PhoneNumber }