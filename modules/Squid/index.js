const {DataType} = require("../DataType");
const crypto = require("node:crypto");

class Squid extends DataType{
    static name = "Squid";
    static #syntax = /^([0-9a-fA-F]{32})$/;
    
    constructor(value){
        super()
        this.value = value
    }

    validate(){
        return Squid.validate(this.value)
    }
    static validate(value, {
        syntax = this.#syntax
    } = {}){

        const errors = [];
        
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

    static generate(){
       return crypto.randomUUID().replace(/-/g, "");
    }

}





module.exports = { Squid }