var express = require('express');
var dotenv = process.env.NODE_ENV == "production"
    ? null : require('dotenv').config();
var path = require("path");
var authRouter = express.Router();

var User = require("../models/user");
var Token = require("../models/token");

// init Box SDK
var keys = require("../integrations/boxKeys");
var sdk = require("../integrations/boxSetup");


authRouter.get("/box/auth-params", function (req, res) {
    var env = process.env.NODE_ENV;
    var params = env == "development"
        ? {clientId: keys.dev.id, redirectUri: keys.dev.redirectUri, env:"dev"}
        : env == "production"
        ? {clientId: keys.prod.id, redirectUri: keys.prod.redirectUri, env:"prod"}
        : null;

    res.json(params);
});

authRouter.get("/box", function (req, res) {
    // TODO: hash query.state for security
    // TODO: rewrite horrible callback pyramids
    if (req.query.code && req.query.state && sdk) {
        sdk.getTokensAuthorizationCodeGrant(req.query.code, null, function (err, tokenInfo) {
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

module.exports = authRouter;