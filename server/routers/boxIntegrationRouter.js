var express = require('express');
var boxIntegrationRouter = express.Router();

var Token = require("../models/token");

// Initialize SDK
var BoxSDK = require('box-node-sdk');
var sdk = new BoxSDK({
    clientID: process.env.BOX_CLIENT_ID,
    clientSecret: process.env.BOX_CLIENT_SECRET
});

var invalidTokenError = {
    header: "Token is invalid or expired",
    message: "Please go to Settings and re-authenticate Box"
};

boxIntegrationRouter.post("/", function (req, res) {
    // get token using user ID first
    Token.findOne({userId: req.body.userId, provider: "box"}, function (err, token) {
        if (err || !token.tokenInfo) {
            res.status(500).send(invalidTokenError);
        }

        sdk.getTokensRefreshGrant(token.tokenInfo.refreshToken, function (err, newTokenInfo) {
            if (err || !newTokenInfo.accessToken) {
                res.status(500).send(invalidTokenError);
            }

            var box = sdk.getBasicClient(newTokenInfo.accessToken);
            box.folders.create("0", req.body.folderName, function (err, folder) {
                if (err) {
                    console.log(err);
                    res.status(500).send({
                        header: "Couldn't create folder",
                        message: "You might have insufficient permissions"
                    });
                }
                console.log(folder);
                res.json(folder);
            });
        });
    });
});

module.exports = boxIntegrationRouter;