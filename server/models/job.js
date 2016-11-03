var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var PhaseSchema = new Schema({
    name: {type: String, required: true},
    startDate: {type: String, required: true},
    endDate: {type: String, required: true}
}, {
    timestamps: true
});

var JobSchema = new Schema({
    name: {type: String, required: true},
    clientCodeName: {type: String, required: true},
    brand: String,
    jobNumber: Number,
    projType: String,
    projTags: [String],
    startDate: {type: Date, required: true},
    endDate: {type: Date, required: true},
    phases: [PhaseSchema]
}, {
    timestamps: true
});

module.exports = mongoose.model("Job", JobSchema);