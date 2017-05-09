var mongoose = require("mongoose");
var Schema = mongoose.Schema;

function toLower(s) {
    return s.toLowerCase();
}

var TemplateSchema = new Schema({
    id: {type: String, required: true},
    provider: {type: String, set: toLower, required: true},
    name: {type: String, required: true}
}, {
    timestamps: true
});

module.exports = mongoose.model("Template", TemplateSchema);