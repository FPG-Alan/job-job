var mongoose = require("mongoose");
var Schema = mongoose.Schema;

function toLower(s) {
    return s.toLowerCase();
}

var UserSchema = new Schema({
    name: String,
    email: {type: String, set: toLower, unique: true},
    boxAuthenticated: Boolean
}, {
    timestamps: true
});

module.exports = mongoose.model("User", UserSchema);