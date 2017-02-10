var express = require('express');
var dotenv = process.env.NODE_ENV == "production"
    ? null : require('dotenv').config();
var trelloIntegrationRouter = express.Router();

var Token = require("../models/token");


trelloIntegrationRouter.post("/", function (req, res) {
    console.log("test trello");
    res.json({data: "test"})
});

module.exports = trelloIntegrationRouter;
