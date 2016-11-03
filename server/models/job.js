var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ClientSchema = require("./client");
var PhaseSchema = new Schema({
    name: String,
    phaseCode: String,
    startDate: Date,
    endDate: Date
});

var JobSchema = new Schema({
    name: String,
    client: ClientSchema,
    jobNumber: Number,
    projCode: String,
    projType: String,
    projTags: [String],
    startDate: Date,
    endDate: Date,
    phases: [PhaseSchema]
}, {
    timestamps: true
});

module.exports = mongoose.model("Job", JobSchema);