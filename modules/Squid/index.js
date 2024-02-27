const crypto = require("node:crypto");

const {DataType} = require("../DataType");
const {ErrorSyntax} = require("@VanillaCX/Errors")

class Squid extends DataType{
    static name = "Squid";
    static #syntax = /^([0-9a-fA-F]{32})$/;
    
    constructor(value){
        super()
        this.value = value
    }

    test(){
        return Squid.test(this.value)
    }
    static test(value){

        const errors = [];
        
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

    static generate(){
       return crypto.randomUUID().replace(/-/g, "");
    }

}





module.exports = { Squid }