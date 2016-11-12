var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ProjectCountSchema = new Schema({
    year: String,
    count: Number
});

var ClientSchema = new Schema({
    name: {type: String, required: true},
    shortCode: String,
    rate: String,
    counts: [ProjectCountSchema],
    brands: [String]
},{
    timestamps: true
});

module.exports = mongoose.model("Client", ClientSchema);