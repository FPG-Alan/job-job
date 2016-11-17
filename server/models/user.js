var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: String,
    email: String,
    boxAuthenticated: Boolean
}, {
    timestamps: true
});

module.exports = mongoose.model("User", UserSchema);