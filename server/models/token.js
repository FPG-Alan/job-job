var mongoose = require("mongoose");
var Schema = mongoose.Schema;

function toLower(s) {
    return s.toLowerCase();
}

var TokenSchema = new Schema({
    userId: {type: String, required: true},
    provider: {type: String, set: toLower, required: true},
    tokenInfo: Object
}, {
    timestamps: true
});

module.exports = mongoose.model("Token", TokenSchema);