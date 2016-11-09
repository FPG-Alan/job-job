var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ClientSchema = new Schema({
    name: {type: String, required: true},
    shortCode: String,
    rate: String,
    count: Number,
    brands: [String]
},{
    timestamps: true
});

module.exports = mongoose.model("Client", ClientSchema);