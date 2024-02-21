const {ShortText, Schema, LongText, Email, Flag, Identifier, Password, PhoneNumber, Squid, Stamp, Url} = require("../index.js");



const dataTypeTests = () => {
    // Email
    console.group("Email")
    const emailInstance = new Email("lee@leebowyer.fr")
    console.log(emailInstance.validate())
    console.log(Email.validate("lee@leebowyer.fr"))
    console.groupEnd()

    //Flag 
    console.group("Flag")
    const flagInstance = new Flag(true)
    console.log(flagInstance.validate())
    console.log(flagInstance.toggle())
    console.log(Flag.validate("is this a bool"))
    console.log(Flag.toggle(true))
    console.log(Flag.toggle(false))
    console.groupEnd()

    //Identifier
    console.group("Identifier")
    const identifierInstance = new Identifier("edition")
    console.log(identifierInstance.validate())
    console.log(Identifier.validate("edition"))
    console.groupEnd()

    //LongText
    console.group("LongText")
    const longTextInstance = new LongText("This text can be really long ...")
    console.log(longTextInstance.validate())
    console.log(LongText.validate("This text can be really long ..."))
    console.groupEnd()

    //Password
    console.group("Password")
    const passwordInstance = new Password("UnsafePassword")
    console.log(passwordInstance.validate())
    console.log(Password.validate("UnsafePassword"))
    console.groupEnd()

    //PhoneNumber
    console.group("PhoneNumber")
    const phoneNumberInstance = new PhoneNumber("0110101010101")
    console.log(phoneNumberInstance.validate())
    console.log(PhoneNumber.validate("0110101010101"))
    console.groupEnd()

    //ShortText
    console.group("ShortText")
    const shortTextInstance = new ShortText("Not too long ...")
    console.log(shortTextInstance.validate())

    console.log(ShortText.validate("Not too long ..."))
    console.groupEnd()

    //Squid
    console.group("Squid")
    const generatedSquid = Squid.generate()
    console.log(generatedSquid)

    const squidInstance = new Squid("ae7f3b04242f4a1fbcd14aa298f2cf6e")
    console.log(squidInstance.validate())
    console.log(Squid.validate("ae7f3b04242f4a1fbcd14aa298f2cf6e"))
    console.groupEnd()

    // Stamp
    console.group("Stamp")
    const stampInstance = new Stamp()
    console.log(stampInstance.age)
    console.log(stampInstance.created)
    console.log(stampInstance.validate())

    console.log(Stamp.now())
    console.log(Stamp.age(1708554173638))
    console.log(Stamp.validate(1708554173638))
    console.groupEnd()

    //Url
    console.group("Url")
    const urlInstance = new Url("https://vanilla.cx")
    console.log(urlInstance.validate())

    console.log(Url.validate("https://vanilla.cx"))
    console.groupEnd()
}

dataTypeTests()