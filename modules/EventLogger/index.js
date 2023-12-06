const {DataType} = require("../DataType");

class EventLogger {
    static name = "EventLogger";
    events = []

    constructor(){
    }

    new(label){
        const {valid, errors, sanitised} = ShortText.test(label);

        if(!valid){
            return new Error(errors)
        }

        this.events.push({
            label: sanitised,
            timestamp: Stamp.now()
        })
    }

    find(label){
        const events = this.events.filter(log => log.label === label);
        const timestamps = events.map(log => log.timestamp);

        return timestamps;
    }

    age(label){
        const events = this.events.filter(log => log.label === label);
        const timestamps = events.map(log => {
            return Stamp.age(log.timestamp)
        });

        return timestamps;
    }
}





module.exports = { EventLogger }