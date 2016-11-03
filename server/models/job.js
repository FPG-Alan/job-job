var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ClientSchema = require("./client");
var PhaseSchema = new Schema({
    name: String,
    startDate: Date,
    endDate: Date
},{
    timestamps: true
});

var JobSchema = new Schema({
    name: String,
    client: ClientSchema,
    brand: String,
    jobNumber: Number,
    projType: String,
    projTags: [String],
    startDate: Date,
    endDate: Date,
    phases: [PhaseSchema]
}, {
    timestamps: true
});

module.exports = mongoose.model("Job", JobSchema);