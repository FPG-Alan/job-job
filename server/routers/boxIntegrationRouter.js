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
    // TODO: put finding token steps of this callback hell in a single function
    Token.findOne({userId: req.body.userId, provider: "box"}, function (err, token) {
        if (err || !token || !token.tokenInfo) {
            res.status(500).send(invalidTokenError);
        }
        sdk.getTokensRefreshGrant(token.tokenInfo.refreshToken, function (err, newTokenInfo) {
            if (err || !newTokenInfo || !newTokenInfo.accessToken) {
                res.status(500).send(invalidTokenError);
            } else {
                // store refreshed token
                token.tokenInfo = newTokenInfo;
                token.save();

                var box = sdk.getBasicClient(newTokenInfo.accessToken);
                var parentFolderId = req.body.parentFolderId || process.env.BOX_ROOT_FOLDER;
                var sameNameFound = false;

                box.folders.getItems(parentFolderId, {fields: "name,type,url"}, function (err, data) {
                    if (err) {
                        console.log(err);
                        res.status(500).send({
                            header: "Something failed during folder items retrieval",
                            message: "You might have insufficient permissions"
                        });
                    }
                    // find folder if it exists
                    if (data.total_count > 0) {
                        for (var i = 0; i < data.total_count; i++) {
                            var currItem = data.entries[i];
                            if (currItem.type == "folder" && currItem.name == req.body.folderName) {
                                sameNameFound = true;
                                res.json(currItem);
                            }
                        }
                    }
                    if (!sameNameFound) {
                        // create folder if found none
                        box.folders.create(parentFolderId, req.body.folderName, function (err, folder) {
                            if (err) {
                                console.log(err);
                                res.status(500).send({
                                    header: "Couldn't create folder",
                                    message: "You might have insufficient permissions"
                                });
                            } else {
                                res.json(folder);
                                console.log("Created new Box folder:", req.body.folderName)
                            }
                        });
                    }
                });
            }
        });
    });
});

module.exports = boxIntegrationRouter;