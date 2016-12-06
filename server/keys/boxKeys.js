var dotenv = process.env.NODE_ENV == "production"
    ? null : require('dotenv').config();

var dev = {
    id: process.env.BOX_CLIENT_ID_DEV,
    secret: process.env.BOX_CLIENT_SECRET_DEV,
    redirectUri: process.env.BOX_REDIRECT_URL_DEV
};
var prod = {
    id: process.env.BOX_CLIENT_ID_PROD,
    secret: process.env.BOX_CLIENT_SECRET_PROD,
    redirectUri: process.env.BOX_REDIRECT_URL_PROD
};

exports.dev = dev;
exports.prod = prod;