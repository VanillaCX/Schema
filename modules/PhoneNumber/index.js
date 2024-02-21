const {DataType} = require("../DataType");

class PhoneNumber extends DataType {
    static name = "PhoneNumber";

    constructor(value){
        super()
        this.value = value
    }

    validate(){
        return PhoneNumber.validate(this.value)
    }
    static #minLength = 0;
    static #maxLength = 255;
    static #allowBasicHTML = false;
    
    static validate(value, {
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






module.exports = { PhoneNumber }