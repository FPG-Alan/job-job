var express = require('express');
var dotenv = process.env.NODE_ENV == "production"
    ? null : require('dotenv').config();
var path = require("path");
var authRouter = express.Router();

var User = require("../models/user");
var Token = require("../models/token");

// init Box SDK
var boxKeys = require("../integrations/boxKeys");
var boxSdk = require("../integrations/boxSetup");


// get auth params (e.g. app keys, redirect URL, prod/dev environment, etc.)
authRouter.get("/box/auth-params", function (req, res) {
    var env = process.env.NODE_ENV;
    var params = env == "development"
        ? {clientId: boxKeys.dev.id, redirectUri: boxKeys.dev.redirectUri, env:"dev"}
        : env == "production"
        ? {clientId: boxKeys.prod.id, redirectUri: boxKeys.prod.redirectUri, env:"prod"}
        : null;
    res.json(params);
});

authRouter.get("/trello/auth-params", function (req, res) {
    var env = process.env.NODE_ENV;
    var params = env == "development"
        ? {appKey: process.env.TRELLO_KEY_DEV, redirectUri: process.env.TRELLO_REDIRECT_URL_DEV, env:"dev"}
        : env == "production"
        ? {appKey: process.env.TRELLO_KEY_DEV, redirectUri: process.env.TRELLO_REDIRECT_URL_PROD, env:"prod"}
        : null;
    res.json(params);
});


// save tokens into database
authRouter.get("/box", function (req, res) {
    // TODO: hash query.state for security
    // TODO: rewrite horrible callback pyramids
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
    console.log(req.query);
});

module.exports = authRouter;