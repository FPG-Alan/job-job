var express = require('express');
var unirest = require('unirest');
var tagRouter = express.Router();

var Tag = require("../models/tag");

var tenKApiKeys = require("../integrations/tenKFtSetup");

tagRouter.get("/")

module.exports = tagRouter;
