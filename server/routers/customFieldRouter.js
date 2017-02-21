var express = require('express');
var unirest = require('unirest');
var customFieldRouter = express.Router();

var tenKApiKeys = require("../integrations/tenKFtSetup");


customFieldRouter.get("/", function (req, res) {
    unirest.get(tenKApiKeys.apiUrl + "custom_fields")
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

module.exports = customFieldRouter;