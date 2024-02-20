const {Schema, LongText} = require("../index.js");
const { ShortText } = require("../index.js");








const minus = () => {

    
    const schema = new Schema({
        key: {type:ShortText},
        value: {type:ShortText},
    });
    
    

    const {valid, errors, sanitised} = schema.validate({
        key: "text",
        value: "Text"
    });

    console.log({valid, errors, sanitised});

}

const zero = () => {

    
    const meta = new Schema([{
        tags: {type:ShortText, required: true},
        categories: {type:ShortText, required: true},
    }]);

    const schema = new Schema({
        id: {type: ShortText, required: true},
        label: {type: ShortText, required: true},
        model: {type: ShortText, required: true},
        meta: meta
    });
    
    

    const {valid, errors, sanitised} = schema.validate({
        id: "ONNONONONONON",
        label:"Paul",
        model: "Songs",
        meta: [
            {
                tags: "Tag Text",
                categories: "Cat Text"
            }
        ]
    });

    console.log({valid, errors, sanitised});

}

const one = () => {

    const meta = new Schema([{
        tags: {type:ShortText, required: true},
        categories: {type:ShortText, required: true},
    }]);

    const schema = new Schema({
        id: {type: ShortText, required: true},
        label: {type: ShortText, required: true},
        model: {type: ShortText, required: true},
        meta: {schema:meta, required: true}
    });
    
    

    const {valid, errors, sanitised} = schema.validate({
        id: "ONNONONONONON",
        label:"Paul",
        model: "Songs",
        meta: [
            {
                tags: "Tag Text",
                categories: "Cat Text"
            },{
                tags: "Tag Text",
                categories: "Cat Text"
            }
        ]
    });

    console.log({valid, errors, sanitised});
    if (sanitised && sanitised.meta) {
        console.log(sanitised.meta);

    }

}

const two = () => {

    const meta = new Schema([{
        tags: {type:ShortText, required: true},
        categories: {type:ShortText, required: true},
    }]);

    const schema = new Schema({
        id: {type: ShortText, required: true},
        label: {type: ShortText, required: true},
        model: {type: ShortText, required: true},
        meta: {schema:meta, required: true}
    });
    
    

    const {valid, errors, sanitised} = schema.validate({
        id: "ONNONONONONON",
        label:"Paul",
        model: "Songs",
        meta: [
            {
                tags: "Tag Text",
                categories: "Cat Text"
            },{
                tags: "Tag Text",
                categories: "Cat Text"
            }
        ]
    });

    console.log({valid, errors, sanitised});
    if (sanitised && sanitised.meta) {
        console.log(sanitised.meta);

    }

}

two()



