var dotenv = process.env.NODE_ENV == "production"
    ? null : require('dotenv').config();

var dev = {
    apiUrl: process.env.TEN_K_API_DEV,
    keys: process.env.TEN_K_TOKEN_DEV
};
var prod = {
    apiUrl: process.env.TEN_K_API_PROD,
    keys: process.env.TEN_K_TOKEN_PROD
};

exports.dev = dev;
exports.prod = prod;