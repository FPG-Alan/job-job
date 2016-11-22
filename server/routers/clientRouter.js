var express = require('express');
var unirest = require('unirest');
var clientRouter = express.Router();

var Client = require("../models/client");

var tenKApiKeys = {
    "dev": {
        "url": "https://vnext-api.10000ft.com/api/v1/",
        "keys": process.env.TEN_K_TOKEN_DEV
    },
    "prod": {
        "url": "https://api.10000ft.com/api/v1/"
    }
};

clientRouter.get("/all", function (req, res) {
    Client.find({}, function (err, clients) {
        if (err) {
            res.status(500).send({header: 'Couldn\'t retrieve all clients!'});
        }
        res.json(clients);
    });
});

clientRouter.get("/count-by-year/:client/:year", function (req, res) {
    Client.findOne({name: req.params.client}, function (err, client) {
        if (err) {
            console.log(err);
            res.status(500).send({header: 'Couldn\'t find client!'});
        } else {
            unirest.get(tenKApiKeys.dev.url + "projects?from=" + req.params.year + "-01-01"
                + " with_archived=true&per_page=100000")
                .headers({
                    "Content-Type": "application/json",
                    "auth": tenKApiKeys.dev.keys
                })
                .end(function (response) {
                    var projects = response.body.data;
                    // get only projects that start this year
                    // get only projects that have the same client name
                    projects = projects.filter(function (proj) {
                        var year = new Date(proj.starts_at).getFullYear();
                        return proj.client == client.name && year == req.params.year;
                    });

                    // alternatively, we can add a lot of leading zeroes,
                    // then splice the last 3 or n characters (more efficient
                    // but not necessary for now)
                    var formattedCount = projects.length + 1 >= 100
                        ? "" + (projects.length + 1)
                        : projects.length + 1 >= 10
                        ? "0" + (projects.length + 1)
                        : "00" + (projects.length + 1);


                    res.json({
                        count: projects.length + 1,
                        formattedCount: formattedCount
                    });
                });
        }
    });
});

clientRouter.post("/", function (req, res) {
    Client.findOne({name: req.body.name}, function (err, client) {
        if (client) {
            res.status(500).send({
                header: 'Client name already exists',
                message: 'Please try a different name'
            });
        } else {
            var newClient = new Client(req.body);
            newClient.save(function (err, client) {
                if (err) {
                    res.status(500).send({header: 'Couldn\'t save new client'});
                }
                console.log("Added new Client: " + client.name);
                res.json(client);
            });
        }
    })
});

module.exports = clientRouter;