var express = require('express');
var unirest = require('unirest');
var tagRouter = express.Router();

var Tag = require("../models/tag");

tagRouter.get("/all", function (req, res) {
    Tag.find({}, function (err, tags) {
        if (err) {
            res.status(500).send({header: 'Couldn\'t retrieve all tags'});
            return;
        }
        res.json(tags);
    });
});

tagRouter.post("/", function (req, res) {
    Tag.findOne({name: req.body.tag}, function (err, tag) {
        if (tag) {
            res.status(500).send({
                header: 'Tag already exists',
                message: 'Please try a different tag name'
            });
        } else {
            var newTag = new Tag();
            newTag.name = req.body.tag;
            newTag.save(function (err, tag) {
                if (err) {
                    res.status(500).send({header: 'Couldn\'t save new tag'});
                }
                console.log("Added new Tag: " + tag.name);
                res.json(tag);
            });
        }
    });
});

module.exports = tagRouter;
