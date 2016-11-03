var express = require('express');
var unirest = require('unirest');
var jobRouter = express.Router();

var job = require("../models/job");

var apiKeys = {
    "dev": {
        "url": "https://vnext-api.10000ft.com/api/v1/",
        "keys": process.env.TEN_K_TOKEN_DEV
    },
    "prod": {
        "url": "https://api.10000ft.com/api/v1/"
    }
}

jobRouter.get("/all", function (req, res) {
    // job.find({}, function (err, jobs) {
    //     if (err) {
    //         console.log(err)
    //     }
    //     res.json(jobs);
    // });
    unirest.get(apiKeys.dev.url + "projects")
        .headers({
            "Content-Type": "application/json",
            "auth": apiKeys.dev.keys
        })
        .end(function (response) {
            console.log(response.body);
            res.send(response.body);
        });
});

module.exports = jobRouter;