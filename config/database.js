module.exports = {
    database : 'mongodb://localhost/cmscart',
    flashConstant :  Object.freeze({
        SUCCESS:   Symbol("success"),
        ALERT:  Symbol("info"),
        WARNING: Symbol("warning"),
        DANGER: Symbol("danger")
    })
}