var mongoose = require("mongoose");
var Schema = mongoose.Schema;

function toLower(s) {
    return s.toLowerCase();
}

var TokenSchema = new Schema({
    email: {type: String, set: toLower},
    provider: {type: String, set: toLower},
    tokenInfo: Object
}, {
    timestamps: true
});

module.exports = mongoose.model("Token", TokenSchema);