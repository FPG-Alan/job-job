var mongoose = require("mongoose");
var Schema = mongoose.Schema;

function toLower(s) {
    return s.toLowerCase();
}

var UserSchema = new Schema({
    userId: {type: String, unique: true},
    name: String,
    email: {type: String, set: toLower, unique: true},
    boxAuthenticated: Boolean,
    trelloAuthenticated: Boolean
}, {
    timestamps: true
});

module.exports = mongoose.model("User", UserSchema);