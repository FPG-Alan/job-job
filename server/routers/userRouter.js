var express = require('express');
var userRouter = express.Router();

var User = require("../models/user");

userRouter.get("/all", function (req, res) {
    User.find({}, function (err, users) {
        if (err) {
            res.status(500).send({header: 'Couldn\'t retrieve all users'});
        }
        res.json(users);
    })
});

userRouter.post("/", function (req, res) {
    User.findOne({email: req.body.email}, function (err, user) {
        if (user) {
            res.json(user);
        } else {
            var newUser = new User({
                name: req.body.name,
                email: req.body.email,
                boxAuthenticated: req.body.boxAuthenticated
            });
            newUser.save(function (err, newUser) {
                if (err) {
                    res.status(500).send({header: 'Couldn\'t find or create user with this email'});
                }
                res.json(newUser);
            });
        }
    });
});

module.exports = userRouter;