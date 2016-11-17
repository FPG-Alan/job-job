var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var TokenSchema = new Schema({
    email: String,
    tokens: Object
}, {
    timestamps: true
});

module.exports = mongoose.model("Token", TokenSchema);