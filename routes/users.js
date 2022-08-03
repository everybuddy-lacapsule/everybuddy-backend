var express = require("express");
var router = express.Router();
var UserModel = require("../models/users");

router.get("/getUserDatas", async (req, res, next) => {
  var userDatas;
  var user = await UserModel.findOne({
    _id: req.query.userID,
  });
  if (user) {
    userDatas = user;
  }
  res.json({ userDatas });
});

// ROUTE QUI VERIFIE SI EMAIL EXISTE EN BDD relié à CheckEmailScreen
router.post("/check-email", async function (req, res, next) {
  var errorMessage = '';
  var userEmail = '';
  var emailExists = false;
  var user = await UserModel.findOne({
    email: req.body.email,
  });

  if (!req.body.email || !user) {
    emailExists = false;
    errorMessage = "Veuillez indiquer un email valide";
  } else {
    emailExists = true;
    userEmail = user.email;
  }

  res.json({ emailExists, errorMessage, userEmail});
});

// ROUTE qui vérifie si email et pwd existent en BDD relié à LoginScreen
router.post("/sign-in", async function (req, res, next) {
  var errorMessage = '';
  var isLogin = false;
  var userID = '';
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
      userID = user._id
    }
  } else {
    isLogin = false;
    errorMessage = "Adresse email invalide";
  }

  res.json({ isLogin, errorMessage, userID });
});



module.exports = router;
