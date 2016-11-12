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
            console.log(err);
        }
        // for (i in clients){
        //     var client = clients[i];
        //     // Client
        // }
        res.json(clients);
    });

});

clientRouter.put("/update-counts/:client/:year", function (req, res) {
    Client.find({name: req.params.client}, function (err, client) {
        if (err) {
            console.log(err);
            // TODO: warn user that we couldn't find client
        } else {
            unirest.get(apiKeys.dev.url + "projects?from=" + req.params.year + "-01-01"
                + " with_archived=true&per_page=100000")
                .headers({
                    "Content-Type": "application/json",
                    "auth": apiKeys.dev.keys
                })
                .end(function (response) {
                    var projects = response.body;
                    // TODO: filter out projects that don't start this year
                    // TODO: get project that have the same client name

                    // reset projectCount
                    // get the ProjectCount that belongs to this year
                    for (c in client.counts) {
                        client.counts[c].count = 0;
                    }

                    // update projectCount
                });
        }
    });
});

clientRouter.post("/", function (req, res) {
    Client.findOne({name: req.body.name}, function (err, client) {
        if (client) {
            // TODO: return "Client name already exists - Please try a different name"
            res.status(500).send({error: 'Something failed!'});
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