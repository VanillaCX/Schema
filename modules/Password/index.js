const {DataType} = require("../DataType");

class Password extends DataType {
    static name = "Password";
    constructor(){}
    
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
    
    static test(value, {
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
        
        syntax.forEach((rule) => {
            const occurances = value.match(rule.regexp) || [];
            
            if(occurances.length < rule.min){
                errors.push(`REQUIRES_MIN_${rule.min}_${rule.type.toUpperCase()}`)
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
    
}




module.exports = { Password }