const {DataType} = require("../DataType");

class Stamp extends DataType {
    #created;
    static name = "Stamp";
    static #syntax = /^(\d)+$/;

    constructor(){
        super();
        this.#created = Stamp.now();
    }

    validate(){
        return Stamp.validate(this.created)
    }

    get created(){
        return this.#created
    }

    get age(){
        const startTimestamp = this.created;
        
        return Stamp.now() - startTimestamp;
    }

    static age(timestamp){
        const {valid, errors, sanitised} = this.validate(timestamp);

        if(!valid){
            return new Error(errors)
        }

        return this.now() - sanitised

    }

    static now(){
        return Date.now()
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
}





module.exports = { Stamp }