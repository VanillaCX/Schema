const {Schema, SchemaError, DataTypes} = require("./modules/Schema");

module.exports = {Schema, SchemaError, ...DataTypes, DataTypes}