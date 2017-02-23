var express = require('express');
var unirest = require('unirest');
var customFieldRouter = express.Router();

var tenKApiKeys = require("../integrations/tenKFtSetup");


customFieldRouter.get("/", function (req, res) {
    unirest.get(tenKApiKeys.apiUrl + "custom_fields?namespace=assignables")
        .headers({
            "Content-Type": "application/json",
            "auth": tenKApiKeys.keys
        })
        .end(function (response) {
            if (response.status !== 200) {
                res.status(500).send({header: "Error retrieving custom fields"});
                console.log(response);
            } else {
                res.send(response.body);
            }
        });
});


customFieldRouter.get("/values/:id", function (req, res) {
    unirest.get(tenKApiKeys.apiUrl + "projects/" + req.params.id + "/custom_field_values")
        .headers({
            "Content-Type": "application/json",
            "auth": tenKApiKeys.keys
        })
        .end(function (response) {
            if (response.status !== 200) {
                res.status(500).send({header: "Error retrieving custom field values"});
                console.log(response);
            } else {
                res.send(response.body);
            }
        });
});


customFieldRouter.post("/values/:id", function (req, res) {
    var values = req.body.values || [];

    if (values.length > 0) {
        var resCounts = 0;

        res.write("[");
        for (var v in values) {
            if (values[v].custom_field_id) {
                unirest.post(tenKApiKeys.apiUrl + "projects/" + req.params.id + "/custom_field_values" +
                    "?custom_field_id=" + values[v].custom_field_id +
                    "&project_id=" + req.params.id +
                    "&value=" + values[v].value)
                    .headers({
                        "Content-Type": "application/json",
                        "auth": tenKApiKeys.keys
                    })
                    .end(function (response) {
                        resCounts++;
                        if (response.status !== 200) {
                            res.status(500).end(JSON.stringify({header: "Error create custom field value"}) + "]");
                            console.log(response);
                        } else {
                            if (resCounts >= values.length) {
                                res.end(JSON.stringify(response.body) + "]");
                                console.log("Custom field values for job", req.params.id, "DONE!");
                            } else {
                                res.write(JSON.stringify(response.body) + ",");
                            }
                        }
                    });
            } else {
                resCounts++;
                if (resCounts >= values.length) {
                    res.end("]");
                    console.log("Custom field values for job", req.params.id, "DONE!");
                }
            }
        }
    } else {
        res.json([])
    }
});

module.exports = customFieldRouter;