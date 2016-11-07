var express = require('express');
var unirest = require('unirest');
var jobRouter = express.Router();

var apiKeys = {
    "dev": {
        "url": "https://vnext-api.10000ft.com/api/v1/",
        "keys": process.env.TEN_K_TOKEN_DEV
    },
    "prod": {
        "url": "https://api.10000ft.com/api/v1/"
    }
};

jobRouter.get("/all", function (req, res) {
    unirest.get(apiKeys.dev.url + "projects")
        .headers({
            "Content-Type": "application/json",
            "auth": apiKeys.dev.keys
        })
        .end(function (response) {
            // console.log(response.body);
            res.send(response.body);
        });
});

jobRouter.post("", function (req, res) {
    var newProject = {
        "name": req.body.name
    };
    unirest.post(apiKeys.dev.url + "projects")
        .headers({
            "Accept": "application/json",
            "Content-Type": "application/json",
            "auth": apiKeys.dev.keys
        })
        .send(newProject)
        .end(function (response) {
            console.log(response.body);
            res.send(response.body);
        });
});

module.exports = jobRouter;