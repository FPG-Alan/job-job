var express = require('express');
var path = require("path");
var authRouter = express.Router();

// Initialize SDK
var BoxSDK = require('box-node-sdk');
var sdk = new BoxSDK({
    clientID: process.env.BOX_CLIENT_ID,
    clientSecret: process.env.BOX_CLIENT_SECRET
});

authRouter.get("/box", function (req, res) {
    if (req.query.code) {
        sdk.getTokensAuthorizationCodeGrant(req.query.code, null, function (err, tokenInfo) {
            console.log("getting token:", tokenInfo);
            if (!tokenInfo) {
                res.redirect("/");
            } else {
                // TODO: save tokenInfo associated with a user in a Token table
                res.sendFile(path.join(__dirname + '/../views/success.html'));
            }
        });
    } else {
        res.redirect('/');
    }
});

module.exports = authRouter;