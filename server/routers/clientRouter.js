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
            console.log(err)
        }
        res.json(clients);
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
            })
        }
    })
});

module.exports = clientRouter;