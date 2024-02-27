const {DataType} = require("../DataType");
const {ErrorSyntax, ErrorTooLong, ErrorTooShort} = require("@VanillaCX/Errors")

class Password extends DataType {
    static name = "Password";
    static #minLength = 8;
    static #maxLength = 255;
    
    static #syntax = [
        {
            type: "lowercase",
            regexp: /[a-z]/g,
            min: 2
        },{
            type: "uppercase",
            regexp: /[A-Z]/g,
            min: 2
        },{
            type: "numbers",
            regexp: /[0-9]/g,
            min: 2
        },{
            type: "special",
            regexp: /[@!\-_#.,$()]/g,
            min: 2
        }
    ]
    
    static test(value){
        
        const errors = [];
        value = this.stripHTML(value);
        
        if(value.length < this.#minLength){
            errors.push(ErrorTooShort.code)
        }
        
        if(value.length > this.#maxLength){
            errors.push(ErrorTooLong.code)
        }
        
        this.#syntax.forEach((rule) => {
            const occurances = value.match(rule.regexp) || [];
            
            if(occurances.length < rule.min){
                const errorMessage = `REQUIRES_MIN_${rule.min}_${rule.type.toUpperCase()}`;
                errors.push(new ErrorSyntax(errorMessage))
            }
            
        })
        
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
        return Password.test(this.value)
    }  
    
}




module.exports = { Password }