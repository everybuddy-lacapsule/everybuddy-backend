var express = require("express");
var router = express.Router();
var UserModel = require("../models/users");
var DiscussionModel = require("../models/discussions");
var BuddyModel = require("../models/buddies");

/* GET home page. */
/*
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});
 */

module.exports = router;
