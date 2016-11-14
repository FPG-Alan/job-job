var express = require('express');
var unirest = require('unirest');
var clientRouter = express.Router();

var Client = require("../models/client");

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
    Client.find({}, function (err, clients) {
        if (err) {
            res.status(500).send({error: 'Couldn\'t get all clients!'});
        }
        // for (i in clients){
        //     var client = clients[i];
        //     // Client
        // }
        res.json(clients);
    });

});

clientRouter.get("/count-by-year/:client/:year", function (req, res) {
    Client.findOne({name: req.params.client}, function (err, client) {
        if (err) {
            console.log(err);
            res.status(500).send({error: 'Couldn\'t find client!'});
        } else {
            console.log("client:", client.name)
            unirest.get(apiKeys.dev.url + "projects?from=" + req.params.year + "-01-01"
                + " with_archived=true&per_page=100000")
                .headers({
                    "Content-Type": "application/json",
                    "auth": apiKeys.dev.keys
                })
                .end(function (response) {
                    var projects = response.body.data;
                    // get only projects that start this year
                    // get only projects that have the same client name
                    projects = projects.filter(function (proj) {
                        var year = new Date(proj.starts_at).getFullYear();
                        return proj.client == client.name && year == req.params.year;
                    });

                    var formattedCount = projects.length + 1 < 10
                        ? "0" + (projects.length + 1)
                        : "" + (projects.length + 1);
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
            // TODO: return "Client name already exists - Please try a different name"
            res.status(500).send({error: 'Client already exists!'});
        } else {
            var newClient = new Client(req.body);
            newClient.save(function (err, client) {
                if (err) {
                    res.status(500).send({error: 'Something failed!'});
                }
                console.log("Added new Client: " + client.name);
                res.json(client);
            });
        }
    })
});

module.exports = clientRouter;