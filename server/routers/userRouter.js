var express = require('express');
var userRouter = express.Router();

var user = require("../models/user");

userRouter.get("/all", function (req, res) {
    user.find({}, function (err, users) {
        if (err) {
            console.log(err)
        }
        res.json(users);
    });
});

module.exports = userRouter;