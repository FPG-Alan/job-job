var express = require('express');
var boxIntegrationRouter = express.Router();

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
    // TODO: get token using user ID first
    sdk.getTokensRefreshGrant(tokenInfo.refreshToken, function (err, newTokenInfo) {
        if (err) {
            res.status(500).send(invalidTokenError);
        }
        var box = sdk.getBasicClient(newTokenInfo.accessToken);
        box.folders.create("0", req.body.folderName, function (err, folder) {
            if (err) {
                console.log(err);
                res.status(500).send({
                    header: "Couldn't create folder"
                });
            }
            res.json(folder);
        });
    });
});

module.exports = boxIntegrationRouter;