var express = require('express');
var unirest = require('unirest');
var dotenv = process.env.NODE_ENV == "production"
    ? null : require('dotenv').config();
var trelloIntegrationRouter = express.Router();

var Token = require("../models/token");
var apiUrl = process.env.TRELLO_API_URL;
var apiKey = process.env.TRELLO_KEY_DEV;
var siteTemplateBoardId = process.env.TRELLO_SITE_TEMPLATE_ID;
var bannerTemplateBoardId = process.env.TRELLO_BANNER_TEMPLATE_ID;

var invalidTokenError = {
    header: "Token is invalid or expired",
    message: "Please go to Settings and re-authenticate Trello"
};


trelloIntegrationRouter.post("/", function (req, res) {
    Token.findOne({userId: req.body.userId, provider: "trello"}, function (err, token) {
        if (err) {
            res.statusCode.send(invalidTokenError);
        } else {
            var newBoard = {
                name: req.body.boardName,
                defaultLists: false,
                idOrganization: "50d4a4c24b33fac54e002c35",
                idBoardSource: req.body.serviceType == "site" ? siteTemplateBoardId
                    : req.body.serviceType == "banner" ? bannerTemplateBoardId
                    : null,
                keepFromSource: "cards",
                prefs_permissionLevel: "org"
            };

            // TODO: find token
            unirest.post(apiUrl + "boards" +
                "?key=" + apiKey +
                "&token=...")
                .headers({
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "auth": tenKApiKeys.keys
                })
                .send(newBoard)
                .end(function (response) {
                    // TODO: handle err
                    if (response.status !== 200) {
                        console.log(response);
                    }
                    res.send(response.body);
                });
        }
    });
});

module.exports = trelloIntegrationRouter;
