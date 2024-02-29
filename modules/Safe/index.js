const {DataType} = require("../DataType");
const {ErrorReservedWord, ErrorSyntax, ErrorType, ErrorTooLong, ErrorTooShort} = require("@VanillaCX/Errors")

class Safe extends DataType {
    constructor(value){
        super(value)
    }

    static name = "Safe"

    static #reserved = ["script"]

    static #minLength = 2;
    static #maxLength = 255;
    static #syntax = /[^a-zA-Z0-9- \.]/;

    static get reserved () {
        return this.#reserved
    }

    static test(value, user_reserved = []){
        const errors = []

        const black_list = [...this.reserved, ...user_reserved]

        value = this.stripHTML(value);
        const lower_case = value.toLowerCase()

        const includes_reserved_words = black_list.find((word) => lower_case.indexOf(word) > -1);

        if(includes_reserved_words){
            errors.push(ErrorReservedWord.code)
        }

        if(typeof value === "number"){
            value = value.toString();
        }

        if(typeof value === "string"){
            value = this.stripHTML(value);

        } else {
            errors.push(ErrorType.code)
        }

        if(value.length < this.#minLength){
            errors.push(ErrorTooShort.code)
        }
        
        if(value.length > this.#maxLength){
            errors.push(ErrorTooLong.code)
        }

        if(this.#syntax.test(value)){
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

    test(){
        return Safe.test(this.value)
    }
    
}

module.exports = { Safe }