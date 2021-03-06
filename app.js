var express = require("express"),
    dotenv = process.env.NODE_ENV == "production"
        ? null // Heroku already has its own way of reading config vars
        : require('dotenv').config(), // read .env file (.gitignore-d)
    path = require("path"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    app = express(),
    jwt = require('express-jwt'),
    authenticate = jwt({
        secret: process.env.AUTH0_CLIENT_SECRET,
        audience: process.env.AUTH0_CLIENT_ID
    }); // since december 2016 Auth0 no longer stores client Secret with Base64 encoding

// Settings
app.use(bodyParser.urlencoded({extended: false})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/job-job"); // connect to database

// Import routers
var userRouter = require("./server/routers/userRouter");
var jobRouter = require("./server/routers/jobRouter");
var clientRouter = require("./server/routers/clientRouter");
var rateCardRouter = require("./server/routers/rateCardRouter");
var customFieldRouter = require("./server/routers/customFieldRouter");
var authRouter = require("./server/routers/authRouter");
// Import routers for integrations
var boxIntegrationRouter = require("./server/routers/boxIntegrationRouter");
var trelloIntegrationRouter = require("./server/routers/trelloIntegrationRouter");
var slackIntegrationRouter = require("./server/routers/slackIntegrationRouter");

// API routers
app.use("/user", authenticate, userRouter);
app.use("/job", authenticate, jobRouter);
app.use("/client", authenticate, clientRouter);
app.use("/rate-card", authenticate, rateCardRouter);
app.use("/custom-field", authenticate, customFieldRouter);
app.use("/auth", authRouter);
// API routers for integrations
app.use("/box", authenticate, boxIntegrationRouter);
app.use("/trello", authenticate, trelloIntegrationRouter);
app.use("/slack", authenticate, slackIntegrationRouter);


// Resource loading
app.use("/node_modules", express.static(__dirname + "../node_modules"));
app.use("/", express.static(__dirname + "/dist"));

// Serve HTML files
app.get('/', function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

// Error handling
app.use(function handleError(err, req, res, next) {
    if (401 == err.status) { // unauthorized
        console.log(err)
        res.status(401).send({"header": "Unauthorized"});
    } else {
        console.log(err);
        res.redirect('/');
    }
});


// Run app
app.listen(process.env.PORT || '3000', function () {
    console.log("I'm listening on PORT: " + (process.env.PORT || "3000"));
});