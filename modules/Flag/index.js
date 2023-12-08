const {DataType} = require("../DataType");

class Flag extends DataType{
    static name = "Email";
    constructor(){}
    
    static test(value){
        const errors = [];
        
        if(!typeof value === "boolean"){
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