const {DataType} = require("../DataType");
const {ErrorType} = require("@VanillaCX/Errors")

class Flag extends DataType{
    static name = "Flag";

    static toggle(value) {
        return !value
    }

    static test(value){
        const errors = [];

        if(typeof value !== "boolean"){
            errors.push(ErrorType.code)
        }
        
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
        return Flag.test(this.value)
    }

    toggle(){
        return this.value = Flag.toggle(this.value)
    }
    
}



module.exports = { Flag }