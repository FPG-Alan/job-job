var express = require('express');
var unirest = require('unirest');
var Promise = require('promise');
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
        var promises = rates.map(function(rate){
            return editRate(req.params.project, rate)
        });
        Promise.all(promises)
            .done(function (results) {
                res.json(results);
            }, function (err) {
                console.log(err);
                res.status(500).send({header: "Failed to change all rates"});
            })
    } else {
        res.json([])
    }
});

function editRate(projectId, rate) {
    return new Promise(function (resolve, reject) {
        unirest.put(tenKApiKeys.apiUrl + "projects/" + projectId +
            "/bill_rates/" + rate.id)
            .headers({
                "Content-Type": "application/json",
                "auth": tenKApiKeys.keys
            })
            .send({
                rate: rate.rate
            })
            .end(function (response) {
                if (response.status !== 200) {
                    reject(response.err);
                } else {
                    // console.log("Bill rates updating progress (", rates[resCounts - 1].rate, "):", resCounts, "/", rates.length);
                    var newRate = response.body;
                    resolve(newRate);
                }
            });
    });
}


module.exports = rateCardRouter;
