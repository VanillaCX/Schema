class DataType {
    constructor(value){
        this.value = value
    }

    static #allowBasicHTML = false;
    static #removeAllHTMLTags = /(<[^>]+>)/g;
    static #keepBasicHTMLTags = /(<[^>]+>)/g;


    static stripHTML(value, {allowBasicHTML = DataType.#allowBasicHTML} = {}){
        value = String(value)
        const regExp = (allowBasicHTML) ? DataType.#keepBasicHTMLTags : DataType.#removeAllHTMLTags;

        const stripped = value.replace(regExp, "");

        return stripped
    }
}

module.exports = {DataType}
