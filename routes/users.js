var express = require("express");
var router = express.Router();
var UserModel = require("../models/users");

require("dotenv").config();
const { API_MAP_TOKEN } = process.env;
const NodeGeocoder = require("node-geocoder");
const options = {
  provider: "google",

  // Optional depending on the providers
  apiKey: API_MAP_TOKEN,
  formatter: null, // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(options);

const calculRadius = (longDegree, latDegree, radius) => {
  let diffLongFr = Number(radius) * 0.054;
  let diffLatFr = Number(radius) * 0.009;
  let longMaxDegree = longDegree + diffLongFr;
  let longMinDegree = longDegree - diffLongFr;
  let latMaxDegree = latDegree + diffLatFr;
  let latMinDegree = latDegree - diffLatFr;
  return { longMaxDegree, longMinDegree, latMaxDegree, latMinDegree };
};

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

// ROUTE QUI VERIFIE SI EMAIL EXISTE EN BDD relié à CheckEmailScreen
router.post("/check-email", async function (req, res, next) {
  var errorMessage = "";
  var userEmail = "";
  var emailExists = false;
  var user = await UserModel.findOne({
    email: req.body.email.toLowerCase(),
  });

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

// ROUTE qui verifie la location remplie par user and find alls users in this location
router.post("/userLocation", async function (req, res, next) {
  let success = false;
  let radius = 10;
  try {
    // Tranform location in Onboarding
    const response = await geocoder.geocode(req.body.location);
    const address = {
      long: Number.parseFloat(response[0].longitude),
      lat: Number.parseFloat(response[0].latitude),
      city: response[0].city,
      country: response[0].countryCode,
    };
    let coordinate = calculRadius(address.long, address.lat, radius);

    var users = await UserModel.find({
      "address.long": {
        $gte: coordinate.longMinDegree,
        $lte: coordinate.longMaxDegree,
      },
      "address.lat": {
        $gte: coordinate.latMinDegree,
        $lte: coordinate.latMaxDegree,
      },
    });
    success = true;
    console.log(users);
    res.status(200).json({ address, success, users, radius });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error, success });
  }
});

// ROUTE qui remplie la DB avec les informations choisis par nouveaux utilisateur
router.put("/userDatas", async function (req, res, next) {
  console.log(req.body);
  try {
    const onboardingUpdate = await UserModel.updateOne(
      { _id: req.body.userID },
      {
        $set: {
          address: req.body.address,
          "work.work": req.body.work,
          "work.typeWork": req.body.typeWork,
          status: req.body.status,
          tags: req.body.tags,
          onboarding: true,
        },
      }
    );
    res.status(200).json(onboardingUpdate.acknowledged);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = router;
