var express = require("express"),
    dotenv = require('dotenv').config(),
    path = require("path"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    app = express(),
    jwt = require('express-jwt'),
    authenticate = jwt({
        secret: new Buffer(process.env.AUTH0_CLIENT_SECRET, 'base64'),
        audience: process.env.AUTH0_CLIENT_ID
    });
;

// Settings
require('dotenv').config();
app.use(bodyParser.urlencoded({extended: false})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/job-job");

// Import routers
var userRouter = require("./server/routers/userRouter");
var jobRouter = require("./server/routers/jobRouter");
var clientRouter = require("./server/routers/clientRouter");

// API routers
app.use("/user", authenticate, userRouter);
app.use("/job", authenticate, jobRouter);
app.use("/client", authenticate, clientRouter);

// Resource loading
app.use("/node_modules", express.static(__dirname + "../node_modules"));
app.use("/", express.static(__dirname + "/dist"));

// Serve HTML files
app.get('/', function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

// Error handling
app.use(function (err, req, res, next) {
    if (401 == err.status) { // unauthorized
        res.redirect('/')
    }
});


// Run app
app.listen(process.env.PORT || '3000', function () {
    console.log("I'm listening on PORT: " + (process.env.PORT || "3000"));
});