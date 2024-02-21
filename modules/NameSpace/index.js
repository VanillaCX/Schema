const {DataType} = require("../DataType");

class NameSpace extends DataType{
    static name = "NameSpace";
    
    constructor(value){
        super()
        this.value = value
    }
    
}


module.exports = { NameSpace }