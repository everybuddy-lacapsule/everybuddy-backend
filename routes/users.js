var express = require("express");
var router = express.Router();
var UserModel = require("../models/users");

/* GET users listing. */
router.post("/sign-in", async function (req, res, next) {
  var errorMessage = '';
  var isLogin = false;
  var user = await UserModel.findOne({
    email: req.body.email,
  });

  if (!req.body.email || !req.body.pwd) {
    isLogin = false;
    errorMessage = "Veuillez remplir tous les champs";
  } else if (user) {
    if (user.pwd !== req.body.pwd) {
      isLogin = false;
      errorMessage = "Votre password est incorrect";
    } else {
      isLogin = true;
    }
  } else {
    isLogin = false;
    errorMessage = "Adresse email invalide";
  }

  res.json({ isLogin, errorMessage });
});

module.exports = router;
