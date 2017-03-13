var express = require('express');
var unirest = require('unirest');
var dotenv = process.env.NODE_ENV == "production"
    ? null : require('dotenv').config();
var path = require("path");
var authRouter = express.Router();

var User = require("../models/user");
var Token = require("../models/token");

// init Box SDK
var boxKeys = require("../integrations/boxKeys");
var boxSdk = require("../integrations/boxSetup");

// init Slack env var
var slackRedirect = process.env.NODE_ENV == "development" ?
    process.env.SLACK_REDIRECT_URI_DEV : process.env.NODE_ENV == "production" ?
    process.env.SLACK_REDIRECT_URI_PROD : null;

// get auth params (e.g. app keys, redirect URL, prod/dev environment, etc.)
authRouter.get("/box/auth-params", function (req, res) {
    var env = process.env.NODE_ENV;
    var params = env == "development"
        ? {clientId: boxKeys.dev.id, redirectUri: boxKeys.dev.redirectUri, env: "dev"}
        : env == "production"
        ? {clientId: boxKeys.prod.id, redirectUri: boxKeys.prod.redirectUri, env: "prod"}
        : null;
    res.json(params);
});

authRouter.get("/slack/auth-params", function (req, res) {
    var env = process.env.NODE_ENV;
    var params = env == "development" ? {
        clientId: process.env.SLACK_CLIENT_ID,
        redirectUri: process.env.SLACK_REDIRECT_URI_DEV,
        teamId: process.env.SLACK_TEAM_ID,
        env: "dev"
    } : env == "production" ? {
        clientId: process.env.SLACK_CLIENT_ID,
        redirectUri: process.env.SLACK_REDIRECT_URI_PROD,
        teamId: process.env.SLACK_TEAM_ID,
        env: "prod"
    } : null;
    res.json(params);
});


// save tokens into database
authRouter.get("/box", function (req, res) {
    // TODO: hash query.state for security
    // TODO: rewrite horrible callback pyramids
    // this is the auth callback URL which contains the token/code in the query
    if (req.query.code && req.query.state && boxSdk) {
        boxSdk.getTokensAuthorizationCodeGrant(req.query.code, null, function (err, tokenInfo) {
            if (err) res.redirect('/');

            if (tokenInfo) {
                console.log("token:", tokenInfo);
                Token.findOne(
                    {userId: req.query.state, provider: "box"},
                    function (err, token) {
                        if (err) res.redirect('/');

                        var newToken = {};
                        if (!token) { // token object doesn't exist; making a new one
                            newToken = new Token({
                                userId: req.query.state,
                                provider: "box",
                                tokenInfo: tokenInfo
                            });
                        } else { // token object exists; overwriting
                            newToken = token;
                            newToken.tokenInfo = tokenInfo;
                        }

                        newToken.save(function (err, token) {
                            if (err) res.redirect('/');

                            User.findOne({userId: req.query.state}, function (err, user) {
                                if (user) {
                                    user.boxAuthenticated = true;
                                    user.save(function (err, user) {
                                        // SUCCESS at last
                                        res.sendFile(path.join(__dirname + '/../views/success.html'));
                                    });
                                }
                            });
                        });
                    }
                );
            }
        });
    } else {
        res.redirect('/');
    }
});

authRouter.get("/trello", function (req, res) {
    if (req.query.userId) {
        if (!req.query.token) {
            res.sendFile(path.join(__dirname + '/../views/trello_auth.html'));
        } else {
            Token.findOne({userId: req.query.userId, provider: "trello"}, function (err, token) {
                var newToken = {};
                if (!token) { // token object doesn't exist; making a new one
                    newToken = new Token({
                        userId: req.query.userId,
                        provider: "trello",
                        tokenInfo: {token: req.query.token}
                    });
                } else { // token object exists; overwriting
                    newToken = token;
                    newToken.tokenInfo = {token: req.query.token};
                }

                newToken.save(function (err, token) {
                    User.findOne({userId: req.query.userId}, function (err, user) {
                        if (user) {
                            user.trelloAuthenticated = true;
                            user.save(function (err, user) {
                                res.sendFile(path.join(__dirname + '/../views/success.html'));
                            });
                        } else {
                            res.sendFile(path.join(__dirname + '/../views/success.html'));
                        }
                    });
                });
            });
        }
    } else {
        res.sendFile(path.join(__dirname + '/../views/success.html'));
    }
});

authRouter.get("/slack", function (req, res) {
    if (req.query.code && req.query.state) {
        // TODO: check state if match user
        unirest.get(process.env.SLACK_API_URL + "oauth.access" +
            "?client_id=" + process.env.SLACK_CLIENT_ID +
            "&client_secret=" + process.env.SLACK_CLIENT_SECRET +
            "&code=" + req.query.code +
            "&redirect_uri=" + slackRedirect)
            .headers({
                "Accept": "application/json",
                "Content-Type": "application/json"
            })
            .end(function (response) {
                if (response.status !== 200 || response.body.error) {
                    console.log(response.body);
                } else {
                    Token.findOne({userId: req.query.state, provider: "slack"}, function (err, token) {
                        var newToken = {};
                        if (!token) { // token object doesn't exist; making a new one
                            newToken = new Token({
                                userId: req.query.state,
                                provider: "slack",
                                tokenInfo: response.body
                            });
                        } else { // token object exists; overwriting
                            newToken = token;
                            newToken.tokenInfo = response.body;
                        }

                        newToken.save(function (err, token) {
                            User.findOne({userId: req.query.state}, function (err, user) {
                                if (user) {
                                    user.slackAuthenticated = true;
                                    user.save(function (err, user) {
                                        res.sendFile(path.join(__dirname + '/../views/success.html'));
                                    });
                                } else {
                                    res.sendFile(path.join(__dirname + '/../views/success.html'));
                                }
                            });
                        });
                    });
                }
            });
    } else {
        res.sendFile(path.join(__dirname + '/../views/success.html'));
    }
});

module.exports = authRouter;