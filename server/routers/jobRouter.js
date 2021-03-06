var express = require('express');
var unirest = require('unirest');
var jobRouter = express.Router();

var tenKApiKeys = require("../integrations/tenKFtSetup");


jobRouter.get("/all", function (req, res) {
    unirest.get(tenKApiKeys.apiUrl + "projects?with_archived=true&per_page=100000" +
        "&fields=custom_field_values")
        .headers({
            "Content-Type": "application/json",
            "auth": tenKApiKeys.keys
        })
        .end(function (response) {
            if (response.status !== 200) {
                res.status(500).send({header: "Error retrieving job list"});
                console.log(response);
            } else {
                res.send(response.body);
            }
        });
});

jobRouter.post("/", function (req, res) {
    var newProject = {
        "name": req.body.finalName,
        "client": req.body.job.client.name,
        "starts_at": req.body.job.startDate,
        "ends_at": req.body.job.endDate,
        "project_code": req.body.job.code,
        "project_state": "Tentative",
        "description": req.body.job.description
    };
    unirest.post(tenKApiKeys.apiUrl + "projects")
        .headers({
            "Accept": "application/json",
            "Content-Type": "application/json",
            "auth": tenKApiKeys.keys
        })
        .send(newProject)
        .end(function (response) {
            if (response.status !== 200) {
                res.status(500).send({header: "Error creating a project in 10,000ft"});
                console.log(response);
            } else {
                res.send(response.body);
            }
        });
});

jobRouter.get("/by-id/:id", function (req, res) {
    unirest.get(tenKApiKeys.apiUrl + "projects/" + req.params.id)
        .headers({
            "Content-Type": "application/json",
            "auth": tenKApiKeys.keys
        })
        .end(function (response) {
            if (response.status !== 200) {
                res.status(500).send({header: "Could not retrieve by project", message: "Project might not exist"});
                console.log(response);
            } else {
                res.send(response.body);
            }
        });
});

jobRouter.get("/by-client/:client", function (req, res) {
    unirest.get(tenKApiKeys.apiUrl + "projects?with_archived=true&per_page=100000")
        .headers({
            "Content-Type": "application/json",
            "auth": tenKApiKeys.keys
        })
        .end(function (response) {
            if (response.status !== 200) {
                res.status(500).send({header: "Could not find projects by client name"});
                console.log(response.body);
                return;
            }
            var jobs = response.body.data.filter(function (job) {
                if (!isBlank(job.client) && !isBlank(req.params.client)) {
                    return job.client.toLowerCase() == req.params.client.toLowerCase();
                }
                return false;
            });
            res.send(jobs);
        });
});

function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}

module.exports = jobRouter;