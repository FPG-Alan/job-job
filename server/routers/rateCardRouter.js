var express = require('express');
var unirest = require('unirest');
var rateCardRouter = express.Router();

var tenKApiKeys = require("../integrations/tenKFtSetup");


rateCardRouter.get("/:project", function (req, res) {
    unirest.get(tenKApiKeys.apiUrl + "projects/" + req.params.project + "/bill_rates" +
        "?per_page=100000")
        .headers({
            "Content-Type": "application/json",
            "auth": tenKApiKeys.keys
        })
        .end(function (response) {
            if (response.status !== 200) {
                res.status(500).send({header: "Failed to retrieve bill rates"});
                console.log(response);
            } else {
                res.send(response.body);
            }
        });
});

rateCardRouter.put("/:project", function (req, res) {
    var rates = req.body.rates || [];

    if (rates.length > 0) {
        var resCounts = 0;

        res.write("[");
        for (var r in rates) {
            unirest.put(tenKApiKeys.apiUrl + "projects/" + req.params.project +
                "/bill_rates/" + rates[r].id)
                .headers({
                    "Content-Type": "application/json",
                    "auth": tenKApiKeys.keys
                })
                .send({
                    rate: rates[r].rate
                })
                .end(function (response) {
                    resCounts++;
                    if (response.status !== 200) {
                        res.status(500).end(JSON.stringify({header: "Failed to update bill rates"}) + "]");
                        console.log(response);
                    } else {
                        // console.log("Bill rates updating progress (", rates[resCounts - 1].rate, "):", resCounts, "/", rates.length);
                        if (resCounts >= rates.length) {
                            res.end(JSON.stringify(response.body) + "]");
                            console.log("Bill rates update for job", req.params.project, "DONE!");
                            return;
                        } else {
                            res.write(JSON.stringify(response.body) + ",");
                        }
                    }
                });
        }
    } else {
        res.json([])
    }
});

module.exports = rateCardRouter;
