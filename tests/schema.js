const {ShortText, Schema, LongText, Email, Flag, Identifier, Password, PhoneNumber, Squid, Stamp, Url} = require("../index.js");



const test1 = () => {
    const bookSchema = new Schema({
        id: {type: Squid, required: true, default: Squid.generate()},
        title: {type: ShortText, required: true},
        author: {type: ShortText, required: true}
    })
    
    const bookData = {
        id: "ae7f3b04242f4a1fbcd14aa298f2cf6e",
        title: "The Gruffalo",
        author: "Julia"
    }
    
    const {valid, sanitised, errors} = bookSchema.validate(bookData)
    
    console.log("valid:", valid)
    console.log("sanitised:", sanitised)
    console.log("errors:", errors)

}

const test2 = () => {
    const meta = new Schema({
        created: {type: ShortText, required: true},
        genre: {type: ShortText, required: true, default: "Unclassified"}
    })

    const bookSchema = new Schema({
        id: {type: Squid, required: true, default: Squid.generate()},
        title: {type: ShortText, required: true},
        author: {type: ShortText, required: true},
        meta: {schema: meta, required: true}
    })
    
    const bookData = {
        id: "ae7f3b04242f4a1fbcd14aa298f2cf6e",
        title: "The Gruffalo",
        author: "Julia",
        meta: {
            created: Stamp.now(),
            genre: "Childrens"
        }
    }
    
    const {valid, sanitised, errors} = bookSchema.validate(bookData)
    
    console.log("valid:", valid)
    console.log("sanitised:", sanitised)
    console.log("errors:", errors)
}

const test3 = () => {
    const tags = new Schema([{
        key: {type: ShortText, required: true},
        value: {type: ShortText, required: true, default: "Unclassified"}
    }])

    const bookSchema = new Schema({
        id: {type: Squid, required: true, default: Squid.generate()},
        title: {type: ShortText, required: true},
        author: {type: ShortText, required: true},
        tags: {schema: tags, required: true}
    })
    
    const bookData = {
        id: "ae7f3b04242f4a1fbcd14aa298f2cf6e",
        title: "The Gruffalo",
        author: "Julia",
        tags: [{
            key: Stamp.now(),
            value: "Childrens"
        }]
    }
    
    const {valid, sanitised, errors} = bookSchema.validate(bookData)
    
    console.log("valid:", valid)
    console.log("sanitised:", sanitised)
    console.log("errors:", errors)
}

const test4 = () => {

    const person = new Schema({
        firstName: {type: ShortText, required: true},
        secondName: {type: ShortText, required: true}
    })
    const subtags = new Schema([{
        key: {type: ShortText, required: true},
        value: {type: ShortText, required: true, default: "Unclassified"},
        person: {schema: person, required: true}
    }])

    const tags = new Schema([{
        key: {type: ShortText, required: true},
        value: {type: ShortText, required: true, default: "Unclassified"},
        subtags: {schema: subtags, required: true}
    }])

    const bookSchema = new Schema({
        id: {type: Squid, required: true, default: Squid.generate()},
        title: {type: ShortText, required: true},
        author: {type: ShortText, required: true},
        tags: {schema: tags, required: true}
    })
    
    const bookData = {
        id: "ae7f3b04242f4a1fbcd14aa298f2cf6e",
        title: "The Gruffalo",
        author: "Julia",
        tags: [{
            key: Stamp.now(),
            value: "Childrens",
            subtags: [{
                key: Stamp.now(),
                value: "Childrens",
                person: {
                    firstName: "Lee",
                    secondName: "Bowyer"
                }
            }]
        }]
    }
    
    const {valid, sanitised, errors} = bookSchema.validate(bookData)
    
    console.log("valid:", valid)
    console.log("sanitised:", sanitised)
    console.log("errors:", errors)
}

//test1()
//test2()
//test3()
test4()