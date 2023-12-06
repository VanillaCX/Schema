class SchemaError extends Error {
    constructor(errors){
        super("SchemaError")
        this.errors = errors;
    }
}

module.exports = {SchemaError}
