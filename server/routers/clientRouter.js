var express = require('express');
var unirest = require('unirest');
var clientRouter = express.Router();

var Client = require("../models/client");

var tenKApiKeys = require("../integrations/tenKFtSetup");


clientRouter.get("/all", function (req, res) {
    Client.find({}, function (err, clients) {
        if (err) {
            res.status(500).send({header: 'Couldn\'t retrieve all clients!'});
        }
        res.json(clients);
    });
});

clientRouter.get("/count-by-year", function (req, res) {
    if (!req.query.client || !req.query.year) {
        res.status(500).send({header: 'Need to specify Client and Year'});
        return;
    }
    Client.findOne({name: req.query.client}, function (err, client) {
        if (err) {
            console.log(err);
            res.status(500).send({header: 'Couldn\'t find client!'});
        } else {
            unirest.get(tenKApiKeys.apiUrl + "projects?from=" + req.query.year + "-01-01"
                + " with_archived=true&per_page=100000")
                .headers({
                    "Content-Type": "application/json",
                    "auth": tenKApiKeys.keys
                })
                .end(function (response) {
                    var projects = response.body.data;
                    // get only projects that start this year
                    // get only projects that have the same client name
                    projects = projects.filter(function (proj) {
                        var year = new Date(proj.starts_at).getFullYear();
                        if (!isBlank(proj.client) && !isBlank(client.name)) {
                            return proj.client.toLowerCase() == client.name.toLowerCase()
                                && year == req.query.year;
                        }
                        return false;
                    });

                    // alternatively, we can add a lot of leading zeroes,
                    // then splice the last 3 or n characters (more efficient
                    // but not necessary for now)
                    var formattedCount = projects.length + 1 >= 100
                        ? "" + (projects.length + 1)
                        : projects.length + 1 >= 10
                        ? "0" + (projects.length + 1)
                        : "00" + (projects.length + 1);

                    console.log("Counting projects of client:", client.name);
                    res.json({
                        client: client.name,
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


clientRouter.post("/brand", function (req, res) {
    Client.findOne({name: req.body.client}, function (err, client) {
        if (client) {
            if (!client.brands || client.brands.length == 0) {
                client.brands = []
            }
            if (client.brands.indexOf(req.body.brand) == -1) {
                client.brands.push(req.body.brand);
                client.save(function (err, client) {
                    if (err) {
                        res.status(500).send({header: 'Couldn\'t save new client'});
                    }
                    console.log("Added new Brand: " + req.body.brand);
                    res.json(client);
                });
            } else {
                res.status(500).send({
                    header: 'Brand name already exists',
                    message: 'Please try a different name'
                });
            }
        }
        else {
            res.status(500).send({
                header: 'Couldn\'t add a new brand',
                message: 'Please try a different name'
            });
        }
    })
});

function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}

module.exports = clientRouter;
