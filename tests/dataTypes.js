const {Safe, ShortText, LongText, Email, Flag, Identifier, Password, PhoneNumber, Squid, Stamp, Url} = require("../index.js");



const dataTypeTests = () => {
    // Email
    console.group("Email")
    const emailInstance = new Email("lee@leebowyer.fr")
    console.log(emailInstance.test())
    console.log(Email.test("lee@leebowyer.fr"))
    console.groupEnd()

    //Flag 
    console.group("Flag")
    const flagInstance = new Flag(true)
    console.log(flagInstance.test())
    console.log(flagInstance.toggle())
    console.log(Flag.test("is this a bool"))
    console.log(Flag.toggle(true))
    console.log(Flag.toggle(false))
    console.groupEnd()

    //Identifier
    console.group("Identifier")
    const identifierInstance = new Identifier("edition")
    console.log(identifierInstance.test())
    console.log(Identifier.test("edition"))
    console.groupEnd()

    //LongText
    console.group("LongText")
    const longTextInstance = new LongText("This text can be really long ...")
    console.log(longTextInstance.test())
    console.log(LongText.test("This text can be really long ..."))
    console.groupEnd()

    //Password
    console.group("Password")
    const passwordInstance = new Password("UnsafePassword")
    console.log(passwordInstance.test())
    console.log(Password.test("UnsafePassword"))
    console.groupEnd()

    //PhoneNumber
    console.group("PhoneNumber")
    const phoneNumberInstance = new PhoneNumber("0110101010101")
    console.log(phoneNumberInstance.test())
    console.log(PhoneNumber.test("0110101010101"))
    console.groupEnd()

    //ShortText
    console.group("ShortText")
    const shortTextInstance = new ShortText("Not too long ...")
    console.log(shortTextInstance.test())

    console.log(ShortText.test("Not too long ..."))
    console.groupEnd()

    //Squid
    console.group("Squid")
    const generatedSquid = Squid.generate()
    console.log(generatedSquid)

    const squidInstance = new Squid("ae7f3b04242f4a1fbcd14aa298f2cf6e")
    console.log(squidInstance.test())
    console.log(Squid.test("ae7f3b04242f4a1fbcd14aa298f2cf6e"))
    console.groupEnd()

    // Stamp
    console.group("Stamp")
    const stampInstance = new Stamp()
    console.log(stampInstance.age)
    console.log(stampInstance.created)
    console.log(stampInstance.test())

    console.log(Stamp.now())
    console.log(Stamp.age(1708554173638))
    console.log(Stamp.test(1708554173638))
    console.groupEnd()

    //Url
    console.group("Url")
    const urlInstance = new Url("https://vanilla.cx")
    console.log(urlInstance.test())

    console.log(Url.test("https://vanilla.cx"))
    console.groupEnd()

    const user_test = "thssdsis-shouldbe.valid";
    console.log(Safe.test(user_test, ["ssds"]))
    console.log(Safe.test("sCrIpT"))    
}

dataTypeTests()


