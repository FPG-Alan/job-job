// select keys in respect to dev/prod environment
var keys = require("./tenKFtKeys");

var apiKeys = process.env.NODE_ENV == "production" ? keys.prod
    : process.env.NODE_ENV == "development" ? keys.dev
    : null;

module.exports = apiKeys;