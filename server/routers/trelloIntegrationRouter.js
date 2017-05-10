var express = require('express');
var unirest = require('unirest');
var dotenv = process.env.NODE_ENV == "production"
    ? null : require('dotenv').config();
var trelloIntegrationRouter = express.Router();
var requireRole = require("../middlewares/requiredRole");

var Token = require("../models/token");
var Template = require("../models/template");
var apiUrl = process.env.TRELLO_API_URL;
var apiKey = process.env.TRELLO_KEY;
var siteTemplateBoardId = process.env.TRELLO_SITE_TEMPLATE_ID;
var bannerTemplateBoardId = process.env.TRELLO_BANNER_TEMPLATE_ID;

var invalidTokenError = {
    header: "Token is invalid or expired",
    message: "Please go to Settings and re-authenticate Trello"
};


trelloIntegrationRouter.post("/", function (req, res) {
    Token.findOne({userId: req.body.userId, provider: "trello"}, function (err, token) {
        if (err || !token || !token.tokenInfo || !token.tokenInfo.token) {
            res.status(500).send(invalidTokenError);
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

trelloIntegrationRouter.get("/template", function (req, res) {
    Template.find({}, function (err, templates) {
        if (templates) {
            return res.json(templates);
        } else {
            return res.status(500).send({header: 'Couldn\'t retrieve all Trello templates!'});
        }
    });
});

trelloIntegrationRouter.post("/template", requireRole("admin"), function (req, res) {
    if (!req.body.id || !req.body.name) {
        return res.status(500).send({
            header: 'Couldn\'t create new Trello template',
            message: 'Please specify board ID and name'
        });
    }
    Template.findOne({id: req.body.id, provider: "trello"}, function (err, template) {
        if (template) {
            res.status(500).send({
                header: 'Template already exists',
                message: 'Please try a different ID'
            });
        } else {
            var newTemplate = new Template({
                id: req.body.id,
                provider: "trello",
                name: req.body.name
            });
            newTemplate.save(function (err, t) {
                if (err) {
                    console.log(err);
                    res.status(500).send({header: 'Couldn\'t save new template'});
                } else {
                    console.log("Added new Template: " + t.name);
                    res.json(t);
                }
            });
        }
    })
});


module.exports = trelloIntegrationRouter;
