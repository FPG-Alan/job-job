var express = require('express');
var userRouter = express.Router();

var User = require("../models/user");

userRouter.get("/", function (req, res) {
    User.findOne({userId: req.query.id}, function (err, user) {
        if (user) {
            return res.json(user);
        } else {
            return res.status(500).send({header: 'Couldn\'t find your user data'});
        }
    });
});

userRouter.post("/", function (req, res) {
    User.findOne({userId: req.body.userId}, function (err, user) {
        if (user) {
            res.json(user);
        } else {
            var newUser = new User({
                userId: req.body.userId,
                name: req.body.name,
                email: req.body.email,
                boxAuthenticated: req.body.boxAuthenticated,
                trelloAuthenticated: req.body.trelloAuthenticated,
                slackAuthenticated: req.body.slackAuthenticated
            });
            newUser.save(function (err, newUser) {
                if (err) {
                    res.status(500).send({header: 'Couldn\'t find or create user with this email'});
                    return
                }
                res.json(newUser);
            });
        }
    });
});

module.exports = userRouter;