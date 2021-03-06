var express = require('express');
var unirest = require('unirest');
var dotenv = process.env.NODE_ENV == "production"
    ? null : require('dotenv').config();
var slackIntegrationRouter = express.Router();

var Token = require("../models/token");
var apiUrl = process.env.SLACK_API_URL;
var teamId = process.env.SLACK_TEAM_ID;

var invalidTokenError = {
    header: "Token is invalid or expired",
    message: "Please go to Settings and re-authenticate Slack"
};


slackIntegrationRouter.post("/", function (req, res) {
    Token.findOne({userId: req.body.userId, provider: "slack"}, function (err, token) {
        if (err || !token || !token.tokenInfo || !token.tokenInfo.access_token) {
            res.status(500).send(invalidTokenError);
        } else {
            if (req.body.channelName) {
                unirest.post(apiUrl + "channels.create/" +
                    "?token=" + token.tokenInfo.access_token +
                    "&name=" + req.body.channelName.toLowerCase())
                    .headers({
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                    })
                    .end(function (response) {
                        if (response.status !== 200 || !response.body.ok) {
                            var errorMessage = {header: "Failed to create new Slack channel"};
                            if (response.body.error == "name_taken") {
                                errorMessage.message = "Channel name is taken";
                            }
                            res.status(500).send(errorMessage);
                            console.log(response.body);
                        } else {
                            res.send(response.body);
                            console.log("Created new Slack channel:", "...");
                            console.log(response.body);
                        }
                    });
            }
        }
    });
});

module.exports = slackIntegrationRouter;
