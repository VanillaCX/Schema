const {DataType} = require("../DataType");

class Email extends DataType{
    static name = "Email";
    
    constructor(value){
        super()
        this.value = value
    }

    validate(){
        return Email.validate(this.value)
    }
    
    static #minLength = 5;
    static #maxLength = 255;
    static #syntax = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    static get minLength(){
        return Email.#minLength
    }

    static get maxLength(){
        return Email.#minLength
    }

    static get syntax(){
        return Email.#syntax
    }
    
    static validate(value, {
        syntax = this.#syntax,
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



module.exports = { Email }