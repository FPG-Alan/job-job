var express = require('express');
var unirest = require('unirest');
var userRouter = express.Router();

var user = require("../models/user");

var apiKeys = {
    "dev": {
        "url": "https://vnext-api.10000ft.com/api/v1/",
        "keys": process.env.TEN_K_TOKEN_DEV
    },
    "prod": {
        "url": "https://api.10000ft.com/api/v1/"
    }
};

userRouter.get("/all", function (req, res) {
    // user.find({}, function (err, users) {
    //     if (err) {
    //         console.log(err)
    //     }
    //     res.json(users);
    // });
    unirest.get(apiKeys.dev.url + "users")
        .headers({
            "Content-Type": "application/json",
            "auth": apiKeys.dev.keys
        })
        .end(function (response) {
            console.log(response.body);
            res.send(response.body);
        });
});

module.exports = userRouter;