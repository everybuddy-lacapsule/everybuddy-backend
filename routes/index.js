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


router.get("/", async function (req, res, next) {
  let user = new UserModel ({
    admin: false,
    firstName: "Jonh",
    name: "Doe",
    email: "jg@gmail.com",
    pwd: "123",
    avatar: "",
    status: "",
    presentation: "",
    searchCurrent: "",
    tel: 623456789,
    nbBatch: 55,
    campus: "Lyon",
    cursus: "Dev web",
    address: "10 avenue de l'Europe, 69008",
    jobs: [],
    linkRs: [],
    tags: [{name: 'js', category: 'lang'}],
    buddies: [],
    discussion: [],
  });
  let newUserSaved = await user.save();

  res.render("index", { title: "Express" });
});

module.exports = router;
