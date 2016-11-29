var express = require('express');
var unirest = require('unirest');
var rateCardRouter = express.Router();

var tenKApiKeys = {
    "dev": {
        "url": "https://vnext-api.10000ft.com/api/v1/",
        "keys": process.env.TEN_K_TOKEN_DEV
    },
    "prod": {
        "url": "https://api.10000ft.com/api/v1/"
    }
};

rateCardRouter.get("/roles", function (req, res) {
    unirest.post(tenKApiKeys.dev.url + "roles?per_page=100000")
        .headers({
            "Content-Type": "application/json",
            "auth": tenKApiKeys.dev.keys
        })
        .end(function (response) {
            // TODO: handle err
            console.log("All roles:", response.body);
            res.send(response.body);
        });
});

rateCardRouter.get("/disciplines", function (req, res) {
    unirest.post(tenKApiKeys.dev.url + "disciplines?per_page=100000")
        .headers({
            "Content-Type": "application/json",
            "auth": tenKApiKeys.dev.keys
        })
        .end(function (response) {
            // TODO: handle err
            console.log("All disciplines:", response.body);
            res.send(response.body);
        });
});

rateCardRouter.get("/:project", function (req, res) {
    unirest.get(tenKApiKeys.dev.url + "projects/" + req.params.project + "/bill_rates" +
        "?per_page=100000")
        .headers({
            "Content-Type": "application/json",
            "auth": tenKApiKeys.dev.keys
        })
        .end(function (response) {
            // TODO: handle err
            console.log(response.body);
            res.send(response.body);
        });
});


rateCardRouter.put("/:project/", function (req, res) {
    var newRate = {
        rate: 1000.50
    }; // test
    unirest.put(tenKApiKeys.dev.url + "projects/" + req.params.project +
        "/bill_rates/")
        .headers({
            "Content-Type": "application/json",
            "auth": tenKApiKeys.dev.keys
        })
        .send(newRate)
        .end(function (response) {
            // TODO: handle err
            console.log(response)
            res.send(response.body);
        });

});

module.exports = rateCardRouter;
