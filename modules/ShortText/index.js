const {DataType} = require("../DataType");
const {ErrorType, ErrorTooLong, ErrorTooShort} = require("@VanillaCX/Errors")

class ShortText extends DataType {
    constructor(value){
        super(value)
    }

    static name = "ShortText"

    static #minLength = 2;
    static #maxLength = 255;

    static test(value){
        const errors = []
        value = this.stripHTML(value);

        if(typeof value === "number"){
            value = value.toString();
        }

        if(typeof value === "string"){
            value = this.stripHTML(value);

        } else {
            errors.push(ErrorType.code)
        }

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

    test(){
        return ShortText.test(this.value)
    }
    
}

module.exports = { ShortText }