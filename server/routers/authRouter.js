var express = require('express');
var path = require("path");
var authRouter = express.Router();

var User = require("../models/user");
var Token = require("../models/token");

// Initialize SDK
var BoxSDK = require('box-node-sdk');
var sdk = new BoxSDK({
    clientID: process.env.BOX_CLIENT_ID,
    clientSecret: process.env.BOX_CLIENT_SECRET
});

authRouter.get("/box", function (req, res) {
    // TODO: hash query.state for security
    // TODO: rewrite horrible callback pyramids
    if (req.query.code && req.query.state) {
        sdk.getTokensAuthorizationCodeGrant(req.query.code, null, function (err, tokenInfo) {
            if (tokenInfo) {
                console.log("token:", tokenInfo);
                Token.findOne({email: req.query.state}, function (err, token) {
                    var newToken = {};
                    if (!token) {
                        // token object doesn't exist; making a new one
                        newToken = new Token({
                            email: req.query.state,
                            tokens: {
                                box: tokenInfo
                            }
                        });
                    } else {
                        // token object exists; overwriting
                        newToken = token;
                        if (!newToken.tokens) {
                            newToken.tokens = {box: tokenInfo}
                        } else {
                            newToken.tokens.box = tokenInfo
                        }
                    }
                    newToken.save(function (err, token) {
                        if (token) {
                            User.findOne({email: req.query.state}, function (err, user) {
                                if (user) {
                                    user.boxAuthenticated = true;
                                    user.save(function (err, user) {
                                        // SUCCESS at last
                                        res.sendFile(path.join(__dirname + '/../views/success.html'));
                                    });
                                }
                            });
                        }
                    });
                });
            }
        });
    }
    res.redirect('/');
});

module.exports = authRouter;