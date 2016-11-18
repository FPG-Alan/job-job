var express = require('express');
var boxIntegrationRouter = express.Router();

// Initialize SDK
var BoxSDK = require('box-node-sdk');
var sdk = new BoxSDK({
    clientID: process.env.BOX_CLIENT_ID,
    clientSecret: process.env.BOX_CLIENT_SECRET
});

var invalidTokenMessageHeader = "Token is invalid or expired";
var invalidTokenMessageValue = "Please go to Settings and re-authenticate Box";

boxIntegrationRouter.post("/", function (req, res) {

});

module.exports = boxIntegrationRouter;