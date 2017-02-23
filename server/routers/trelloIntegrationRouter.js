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
        if (err || !token.tokenInfo.token) {
            res.statusCode.send(invalidTokenError);
        } else {
            var newBoard = {
                name: req.body.boardName,
                defaultLists: false,
                idOrganization: "50d4a4c24b33fac54e002c35",
                idBoardSource: req.body.serviceType == "Site" ? siteTemplateBoardId
                    : req.body.serviceType == "Banner" ? bannerTemplateBoardId
                    : null,
                keepFromSource: "cards",
                prefs_permissionLevel: "org"
            };

            unirest.post(apiUrl + "boards" +
                "?key=" + apiKey +
                "&token=" + token.tokenInfo.token)
                .headers({
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                })
                .send(newBoard)
                .end(function (response) {
                    if (response.status !== 200) {
                        res.status(500).send({header: "Failed to copy Trello board"});
                        console.log(response);
                    } else {
                        res.send(response.body);
                        console.log("Created new Trello board:", req.body.boardName);
                    }

                });
        }
    });
});

module.exports = trelloIntegrationRouter;
