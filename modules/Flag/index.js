const {DataType} = require("../DataType");

class Flag extends DataType{
    static name = "Flag";

    constructor(value){
        super()
        this.value = value
    }

    validate(){
        return Flag.validate(this.value)
    }

    toggle(){
        return this.value = Flag.toggle(this.value)
    }

    static toggle(value) {
        return !value
    }

    static validate(value){
        const errors = [];

        if(typeof value !== "boolean"){
            errors.push("TYPE_ERROR")
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



module.exports = { Flag }