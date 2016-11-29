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
    unirest.get(apiKeys.dev.url + "projects?with_archived=true&per_page=100000")
        .headers({
            "Content-Type": "application/json",
            "auth": apiKeys.dev.keys
        })
        .end(function (response) {
            // TODO: handle err
            res.send(response.body);
        });
});

jobRouter.post("/", function (req, res) {
    var newProject = {
        "name": req.body.finalName,
        "client": req.body.job.client.name,
        "starts_at": req.body.job.startDate,
        "ends_at": req.body.job.endDate,
        "project_code": req.body.job.code
    };
    unirest.post(apiKeys.dev.url + "projects")
        .headers({
            "Accept": "application/json",
            "Content-Type": "application/json",
            "auth": apiKeys.dev.keys
        })
        .send(newProject)
        .end(function (response) {
            // TODO: handle err
            res.send(response.body);
        });
});

jobRouter.get("/by-client/:client", function (req, res) {
    unirest.get(apiKeys.dev.url + "projects?with_archived=true&per_page=100000")
        .headers({
            "Content-Type": "application/json",
            "auth": apiKeys.dev.keys
        })
        .end(function (response) {
            // TODO: handle err
            res.send(response.body);
            console.log(response.body);
        });
});

module.exports = jobRouter;