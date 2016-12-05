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

rateCardRouter.get("/:project", function (req, res) {
    unirest.get(tenKApiKeys.dev.url + "projects/" + req.params.project + "/bill_rates" +
        "?per_page=100000")
        .headers({
            "Content-Type": "application/json",
            "auth": tenKApiKeys.dev.keys
        })
        .end(function (response) {
            // TODO: handle err
            res.send(response.body);
        });
});

rateCardRouter.put("/:project", function (req, res) {
    var rates = req.body.rates || [];

    if (rates.length > 0) {
        var resCounts = 0;

        res.write("[");
        for (var r in rates) {
            unirest.put(tenKApiKeys.dev.url + "projects/" + req.params.project +
                "/bill_rates/" + rates[r].id)
                .headers({
                    "Content-Type": "application/json",
                    "auth": tenKApiKeys.dev.keys
                })
                .send({
                    rate: rates[r].rate
                })
                .end(function (response) {
                    // TODO: handle err
                    resCounts++;
                    console.log("Bill rates updating progress (", rates[resCounts - 1].rate, "):", resCounts, "/", rates.length);

                    if (resCounts >= rates.length) {
                        res.end(JSON.stringify(response.body) + "]");
                        console.log("Bill rates update for job", req.params.project, "DONE!");
                    } else {
                        res.write(JSON.stringify(response.body) + ",");
                    }
                });
        }
    } else {
        res.json([])
    }
});

module.exports = rateCardRouter;
