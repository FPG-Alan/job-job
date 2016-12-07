var dotenv = process.env.NODE_ENV == "production"
    ? null : require('dotenv').config();

var dev = {
    apiUrl: "https://vnext-api.10000ft.com/api/v1/",
    keys: process.env.TEN_K_TOKEN_DEV
};
var prod = {
    apiUrl: "https://vnext-api.10000ft.com/api/v1/",
    keys: process.env.TEN_K_TOKEN_PROD
};

exports.dev = dev;
exports.prod = prod;