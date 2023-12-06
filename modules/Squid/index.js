const {DataType} = require("../DataType");

class Squid {
    static name = "Squid";
    static #syntax = /^([0-9a-fA-F]{32})$/;
    
    constructor(){}

    static test(value, {
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