class DataType {
    constructor(){}

    static #allowBasicHTML = false;
    static #removeAllHTMLTags = /(<[^>]+>)/g;
    static #keepBasicHTMLTags = /(<[^>]+>)/g;

    static stripHTML(value, {allowBasicHTML = DataType.#allowBasicHTML} = {}){
        const regExp = (allowBasicHTML) ? DataType.#keepBasicHTMLTags : DataType.#removeAllHTMLTags;

        const stripped = value.replace(regExp, "");

        return stripped
    }
}

module.exports = {DataType}
