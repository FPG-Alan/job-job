var express = require('express');
var unirest = require('unirest');
var authRouter = express.Router();

// passport.use(new BoxStrategy({
//     clientID: process.env.BOX_CLIENT_ID,
//     clientSecret: process.env.BOX_CLIENT_SECRETs,
//     callbackURL: 'http://localhost:3000/user/auth/box/callback'
//   }, box.authenticate()));

// Initialize SDK
var BoxSDK = require('box-node-sdk');
var sdk = new BoxSDK({
    clientID: process.env.BOX_CLIENT_ID,
    clientSecret: process.env.BOX_CLIENT_SECRET
});

var boxAuthApiUrl = "https://account.box.com/api/oauth2/authorize?";

authRouter.get("/box", function (req, res) {
    if (req.query.code) {
        // Get some of that sweet, sweet data!
        sdk.getTokensAuthorizationCodeGrant(req.query.code, null, function (err, tokenInfo) {
            console.log(tokenInfo);

            sdk.getTokensRefreshGrant(tokenInfo.refreshToken, function (err, newTokenInfo) {
                // Create a basic API client
                var box = sdk.getBasicClient(newTokenInfo.accessToken);
                box.users.get(box.CURRENT_USER_ID, null, function (err, currentUser) {
                    if (err) {
                        console.log(err);
                        res.redirect('/');
                    }
                    console.log('Hello, ' + currentUser.name + '!');
                });
            });
        });
    } else {
        res.redirect('/');
    }
    // unirest.get(boxAuthApiUrl + "response_type=code&client_id=" + process.env.BOX_CLIENT_ID
    //     + "&redirect_uri=" + process.env.BOX_REDIRECT_URL)
    //     .headers({
    //         "Content-Type": "application/json"
    //     })
    //     .end(function (response) {
    //     });
});

module.exports = authRouter;