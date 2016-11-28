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

rateCardRouter.get("/", function (req, res) {
    unirest.get(tenKApiKeys.dev.url + "bill_rates?per_page=100000")
        .headers({
            "Content-Type": "application/json",
            "auth": tenKApiKeys.dev.keys
        })
        .end(function (response) {
            console.log(response);
            res.json(response.body);
        });
});

module.exports = rateCardRouter;
