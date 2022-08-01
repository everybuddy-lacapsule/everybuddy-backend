var express = require("express");
var router = express.Router();
var UserModel = require("../models/users");

/* GET users listing. */
router.post("/sign-in", async function (req, res, next) {
  var saved = false;
  var user = await UserModel.findOne({
    email: req.body.email,
  });
  if (user.email === req.body.email && user.pwd === req.body.pwd) {
    saved = true;
  }
  res.json({ saved });
});

module.exports = router;
