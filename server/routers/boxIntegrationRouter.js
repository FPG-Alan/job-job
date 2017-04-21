var express = require('express');
var dotenv = process.env.NODE_ENV == "production"
    ? null : require('dotenv').config();
var boxIntegrationRouter = express.Router();

var Token = require("../models/token");

// init Box SDK
var boxKeys = require("../integrations/boxKeys");
var rootFolder =
    process.env.NODE_ENV == "production" ? boxKeys.prod.rootFolder
        : process.env.NODE_ENV == "development" ? boxKeys.dev.rootFolder
        : null;
var sdk = require("../integrations/boxSetup");
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
        } else {
            sdk.getTokensRefreshGrant(token.tokenInfo.refreshToken, function (err, newTokenInfo) {
                if (err || !newTokenInfo || !newTokenInfo.accessToken) {
                    res.status(500).send(invalidTokenError);
                } else {
                    // store refreshed token
                    token.tokenInfo = newTokenInfo;
                    token.save();

                    var box = sdk.getBasicClient(newTokenInfo.accessToken);
                    var parentFolderId = req.body.parentFolderId || rootFolder;
                    var sameNameFound = false;

                    box.folders.getItems(parentFolderId, {fields: "name,type,url"}, function (err, data) {
                        if (err) {
                            var header = "Something failed during folder items retrieval";
                            return handleBoxError(err, header, res);
                        }
                        // find folder if it exists
                        if (data && data.total_count > 0) {
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
                                    var header = "Couldn't create folder";
                                    return handleBoxError(err, header, res);
                                } else {
                                    res.json(folder);
                                    console.log("Created new Box folder:", req.body.folderName)
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

function handleBoxError(err, messageHeader, res) {
    if (err.body) {
        console.log(err.body);
        switch (err.body.code) {
            case "access_denied_insufficient_permissions":
                res.status(401).send({
                    header: messageHeader,
                    message: "You do not have sufficient permissions"
                });
                break;
            case "item_name_invalid":
                res.status(400).send({
                    header: messageHeader,
                    message: "Item name invalid. Should not contain special characters like '\\' or '\/'"
                });
            case "item_name_too_long":
                res.status(400).send({
                    header: messageHeader,
                    message: "Item name too long. The max length for item names is 255 characters."
                });
            default:
                res.status(500).send({
                    header: messageHeader,
                    message: "You might have insufficient permissions"
                });
                break;
        }
    } else {
        res.status(500).send({
            header: messageHeader,
            message: "You might have insufficient permissions"
        });
    }
}

module.exports = boxIntegrationRouter;
