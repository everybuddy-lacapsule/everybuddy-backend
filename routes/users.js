var express = require("express");
var router = express.Router();
var UserModel = require("../models/users");
var cloudinary = require("cloudinary").v2;
const fs = require("fs");
var uniqid = require("uniqid");
var mongoose = require("mongoose");

require("dotenv").config();
const { API_MAP_TOKEN, CLOUD_NAME, API_KEY, API_SECRET } = process.env;

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

const NodeGeocoder = require("node-geocoder");
const UserDeviceTokenModel = require("../models/userDeviceTokens");
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
    if (req.query.userID) {
      var user = await UserModel.findOne({
        _id: req.query.userID,
      });
      if (user) {
        userDatas = user;
      }
      res.json({ userDatas });
    }
  } catch (error) {
    console.log(error);
  }
});
// ROUTE POUR UPDATE LE PROFILE USER
router.post("/updateProfile", async (req, res, next) => {
  try {
    // Tranform location in Onboarding
    const response = await geocoder.geocode(req.body.address.city);
    const address = {
      long: Number.parseFloat(response[0].longitude),
      lat: Number.parseFloat(response[0].latitude),
      city: response[0].city,
      country: response[0].countryCode,
    };
    var updatedUser = await UserModel.updateOne(
      { _id: req.body._id },
      {
        firstName: req.body.firstName,
        name: req.body.name,
        avatar: req.body.avatar,
        status: req.body.status,
        presentation: req.body.presentation,
        searchCurrent: req.body.searchCurrent,
        capsule: {
          nbBatch: req.body.capsule.nbBatch,
          campus: req.body.capsule.campus,
          cursus: req.body.capsule.cursus,
        },
        address: address,
        work: {
          work: req.body.work.work,
          company: req.body.work.company,
          typeWork: req.body.work.typeWork,
        },
        linkRs: {
          linkedin: req.body.linkRs.linkedin,
          github: req.body.linkRs.github,
        },
        tags: req.body.tags,
      }
    );
    var success = true;
    res.status(200).json({ success, country: address.country });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error, success });
  }

  // if (updatedUser){
  //   res.json({sucess: true, updatedUser})
  // }else{
  //   res.json({sucess: false})
  // }
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
    res.status(200).json({ address, success, users, radius });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error, success });
  }
});

// ROUTE qui remplie la DB avec les informations choisis par nouveaux utilisateur
router.put("/userDatas", async function (req, res, next) {
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

// ROUTE QUI UPLAOD LA PHOTO DE L'AVATAR
router.post("/upload", async function (req, res, next) {
  try {
    var imagePath = "./tmp/" + uniqid() + ".jpg";
    var resultCopy = await req.files.photo.mv(imagePath);

    if (!resultCopy) {
      var resultCloudinary = await cloudinary.uploader.upload(imagePath);
      fs.unlinkSync(imagePath);
      res.status(200).json({ url: resultCloudinary.url });
    } else {
      res.status(300).json({ result: false });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// ROUTE POUR RECUPERER LE USER PARTIEL EN BDD POUR LA DISCUSSION
router.get("/getUserDiscussion", async (req, res, next) => {
  let userDatas;
  try {
    if (mongoose.Types.ObjectId.isValid(req.query.userID)) {
      var user = await UserModel.findOne({
        _id: req.query.userID,
      });
      if (user) {
        userDatas = {
          _id: user._id,
          name: user.name,
          firstName: user.firstName,
          avatar: user.avatar,
        };
      }
      res.json({ userDatas });
    }
  } catch (error) {
    console.log(error);
  }
});

// ROUTE QUI VERIFIE OU UPDATE DEVICETOKEN => PERMETTRE ENVOYER LA NOTIFICATION
router.post("/deviceToken", async function (req, res, next) {
  try {
    let userToken = await UserDeviceTokenModel.find({
      userID: req.body.userID,
    });
    if (userToken.length === 0) {
      const newUserDeviceToken = new UserDeviceTokenModel({
        userID: req.body.userID,
        deviceToken: req.body.deviceToken,
      });
      const userDeviceTokenSaved = await newUserDeviceToken.save();
      res.status(200).json(true);
    } else if (userToken.deviceToken === req.body.deviceToken) {
      res.status(200).json(true);
    } else {
      await UserDeviceTokenModel.updateOne(
        { userID: req.body.userID },
        { $set: { deviceToken: req.body.deviceToken } }
      );
      res.status(200).json(true);
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// ROUTE QUI RECUPERE DEVICETOKEN BY USERID => PERMETTRE ENVOYER LA NOTIFICATION
router.get("/deviceToken", async function (req, res, next) {
  try {
    let deviceToken = await UserDeviceTokenModel.find({
      userID: req.query.userID,
    });
    if (deviceToken.length > 0) {
      res.status(200).json({ deviceToken });
    } else {
      //console.log("deviceTokenFalse", deviceToken);
      res.status(404);
    }
  } catch (error) {
    res.status(500).json(error);
  }
});
module.exports = router;
