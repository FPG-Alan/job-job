var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ClientSchema = new Schema({
    name: String,
    codeName: String,
    brands: [String]
},{
    timestamps: true
});

module.exports = mongoose.model("Client", ClientSchema);