var express = require("express");
var router = express.Router();
var UserModel = require("../models/users");

// ROUTE POUR RECUPERER LE USER ENTIER EN BDD
router.get("/getUserDatas", async (req, res, next) => {
  var userDatas;
  try {
    var user = await UserModel.findOne({
      _id: req.query.userID,
    });
    if (user) {
      userDatas = user;
    }
    res.json({ userDatas });
  } catch (error) {
    console.log(error);
  }
});
// ROUTE POUR UPDATE LE PROFILE USER 
router.post("/updateProfile", async (req, res, next) => {
  
  var updatedUser = await UserModel.updateOne(
    { _id : req.body.id},
    { 
        firstName: req.body.firstName,
        name: req.body.name,
        avatar: req.body.avatar,
        status: req.body.status,
        presentation: req.body.presentation,
        searchCurrent: req.body.searchCurrent,
        capsule: {
          nbBatch: req.body.nbBatch,
          campus: req.body.campus,
          cursus: req.body.cursus,
        },
        address: {
          long:  req.body.long, 
          lat: req.body.lat, 
          city: req.body.city, 
          country: req.body.country},
        work: 
        {
          work: req.body.work,
          company: req.body.company,
          typeWork: req.body.typeWork,
        },
        linkRs:
        {
          linkedin: req.body.linkedin,
          github: req.body.github,

        },
        tags: req.body.tags,      
    }
 );
if (updatedUser){
  res.json({sucess: true, updatedUser})
}else{
  res.json({sucess: false})
}
});

// ROUTE QUI VERIFIE SI EMAIL EXISTE EN BDD relié à CheckEmailScreen
router.post("/check-email", async function (req, res, next) {
  var errorMessage = "";
  var userEmail = "";
  var emailExists = false;
  console.log(req.body.email);
  var user = await UserModel.findOne({
    email: req.body.email.toLowerCase(),
  });
  console.log('user', user)

  if (!req.body.email || !user) {
    emailExists = false;
    errorMessage = "Veuillez indiquer un email valide";
  } else {
    emailExists = true;
    userEmail = user.email;
  }

  res.json({ emailExists, errorMessage, userEmail });
});

// ROUTE qui vérifie si email et pwd existent en BDD relié à LoginScreen
router.post("/sign-in", async function (req, res, next) {
  var errorMessage = "";
  var isLogin = false;
  var userDatas;
  var user = await UserModel.findOne({
    email: req.body.email.toLowerCase(),
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
      userDatas = user;
    }
  } else {
    isLogin = false;
    errorMessage = "Adresse email invalide";
  }

  res.json({ isLogin, errorMessage, userDatas });
});

module.exports = router;
