var express = require("express"),
    app = express(),
    path = require("path"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");

// Settings
require('dotenv').config();
app.use(bodyParser.urlencoded({extended: false})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/job-job");

// Import routers
var userRouter = require("./server/routers/userRouter");
var jobRouter = require("./server/routers/jobRouter");

// API routers
app.use("/user", userRouter);
app.use("/job", jobRouter);

// Resource loading
app.use("/node_modules", express.static(__dirname + "../node_modules"));
app.use("/", express.static(__dirname + "/dist"));

// Serve HTML files
app.get('/', function (req, res) {
    res.sendFile(__dirname + "/index.html");
});


// Run app
app.listen(process.env.PORT || '3000', function () {
    console.log("I'm listening on PORT: " + (process.env.PORT || "3000"));
});