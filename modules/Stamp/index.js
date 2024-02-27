const {DataType} = require("../DataType");
const {ErrorSyntax} = require("@VanillaCX/Errors")

class Stamp extends DataType {
    #created;
    static name = "Stamp";
    static #syntax = /^(\d)+$/;

    constructor(){
        super();
        this.#created = Stamp.now();
    }

    test(){
        return Stamp.test(this.created)
    }

    get created(){
        return this.#created
    }

    get age(){
        return Stamp.now() - this.created;
    }

    static age(timestamp){
        const {valid, errors, sanitised} = this.test(timestamp);

        if(!valid){
            return new Error(errors)
        }

        return this.now() - sanitised

    }

    static now(){
        return Date.now()
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
}





module.exports = { Stamp }