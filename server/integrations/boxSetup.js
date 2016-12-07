// setup SDK
var BoxSDK = require('box-node-sdk');
var keys = require("./boxKeys");

var clientId =
    process.env.NODE_ENV == "production" ? keys.prod.id
    : process.env.NODE_ENV == "development" ? keys.dev.id
    : null;
var clientSecret =
    process.env.NODE_ENV == "production" ? keys.prod.secret
    : process.env.NODE_ENV == "development" ? keys.dev.secret
    : null;

var sdk = new BoxSDK({
    clientID: clientId,
    clientSecret: clientSecret
});

module.exports = sdk;