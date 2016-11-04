var express = require('express');
var unirest = require('unirest');
var clientRouter = express.Router();

var client = require("../models/client");

var apiKeys = {
    "dev": {
        "url": "https://vnext-api.10000ft.com/api/v1/",
        "keys": process.env.TEN_K_TOKEN_DEV
    },
    "prod": {
        "url": "https://api.10000ft.com/api/v1/"
    }
};

clientRouter.get("/all", function (req, res) {
    client.find({}, function (err, clients) {
        if (err) {
            console.log(err)
        }
        res.json(clients);
    });

});

module.exports = clientRouter;