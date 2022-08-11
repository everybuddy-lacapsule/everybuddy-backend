var express = require("express");
var router = express.Router();
var UserModel = require("../models/users");
var DiscussionModel = require("../models/discussions");
var BuddyModel = require("../models/buddies");
const axios = require("axios");
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
  let diffLongFr = Number(radius) * 0.061;
  let diffLatFr = Number(radius) * 0.0097;
  let longMaxDegree = longDegree + diffLongFr;
  let longMinDegree = longDegree - diffLongFr;
  let latMaxDegree = latDegree + diffLatFr;
  let latMinDegree = latDegree - diffLatFr;
  return { longMaxDegree, longMinDegree, latMaxDegree, latMinDegree };
};

// Route Location in Onboarding
// router.post("/addLocation", async (req, res, next) => {
//   var location;
//   const response = await geocoder.geocode(req.body.location);
//   location = {
//     long: Number.parseFloat(response[0].longitude),
//     lat: Number.parseFloat(response[0].latitude),
//   };

//   await UserModel.updateOne(
//     { _id: req.body.id },
//     {
//       address: location,
//     }
//   );
// });

// Route search
router.post("/search", async (req, res, next) => {
  try {
    // INIT variable de response (location)
    var location;

    // default radius treatment
    var radius = req.body.radius;
    if (!req.body.radius) {
      radius = 600;
    }
    if (req.body.radius === 100) {
      radius = 600;
      location = {
        long: 2.4302,
        lat: 46.536,
        radius: radius,
        locationRequest: "",
      };
    }
    // default location request treatment
    var locationRequest = req.body.location;
    if (!req.body.location) {
      location = {
        long: 2.4302,
        lat: 46.536,
        radius: 600,
        locationRequest: "",
      };
    } else if (
      req.body.location === "France" ||
      req.body.location === "france" ||
      req.body.location === "france " ||
      req.body.location === "France "
    ) {
      location = {
        long: 2.4302,
        lat: 46.536,
        radius: 600,
        locationRequest: "",
      };
    } else if (
      req.body.location === "Monde" ||
      req.body.location === "Monde " ||
      req.body.location === "monde" ||
      req.body.location === "monde "
    ) {
      location = {
        long: 2.4302,
        lat: 46.536,
        radius: 20000,
        locationRequest: "",
      };
    }
    // default cursus treatment
    var cursus = req.body.cursus;
    if (req.body.cursus.length < 1) {
      cursus = { $exists: true };
    }
    // default campus treatment
    var campus = req.body.campus;
    if (req.body.campus.length < 1) {
      campus = { $exists: true };
    }
    // default work treatment
    var work = req.body.work;
    if (req.body.work.length < 1) {
      work = { $exists: true };
    }
    // default typeWork treatment
    var typeWork = req.body.workType;
    if (req.body.workType.length < 1) {
      typeWork = { $exists: true };
    }
    var tags = req.body.tags;
    // default status treatment
    var status = req.body.status;
    if (req.body.status.length < 1) {
      status = { $exists: true };
    }
    // default batch treatment
    var nbBatch = req.body.nbBatch;
    if (!req.body.nbBatch) {
      nbBatch = { $exists: true };
    }
    // appel de geocode api (google)
    if (!location) {
      const response = await geocoder.geocode(locationRequest);
      console.log(response);
      location = {
        long: Number.parseFloat(response[0].longitude),
        lat: Number.parseFloat(response[0].latitude),
        radius: radius,
        locationRequest: locationRequest,
      };
    }
    //radius en km
    let coordinate = calculRadius(location.long, location.lat, location.radius);

    if (req.body.tags.length > 0) {
      var users = await UserModel.find({
        "address.long": {
          $gte: coordinate.longMinDegree,
          $lte: coordinate.longMaxDegree,
        },
        "address.lat": {
          $gte: coordinate.latMinDegree,
          $lte: coordinate.latMaxDegree,
        },
        "capsule.nbBatch": nbBatch,
        "capsule.cursus": cursus,
        "capsule.campus": campus,
        "work.work": work,
        "work.typeWork": typeWork,
        status: status,
        tags: { $all: tags },
      });
    } else {
      var users = await UserModel.find({
        "address.long": {
          $gte: coordinate.longMinDegree,
          $lte: coordinate.longMaxDegree,
        },
        "address.lat": {
          $gte: coordinate.latMinDegree,
          $lte: coordinate.latMaxDegree,
        },
        "capsule.nbBatch": nbBatch,
        "capsule.cursus": cursus,
        "capsule.campus": campus,
        "work.work": work,
        "work.typeWork": typeWork,
        status: status,
      });
    }

    var success = false;
    users.length > 0 ? (success = true) : (success = false);

    res.status(200).json({
      success,
      users,
      location,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

// Route Location in Search Bar - POUR LE DOSSIER : 1ere route searchByLocation avant implementation search avancee
// router.get("/searchByLocation", async (req, res, next) => {
//   var location;

//   //radius en km
//   let radius = 5;
//   const response = await geocoder.geocode(req.query.location);
//   location = {
//     long: Number.parseFloat(response[0].longitude),
//     lat: Number.parseFloat(response[0].latitude),
//     radius: radius,
//   };

//   let coordinate = calculRadius(location.long, location.lat, radius);

//   var users = await UserModel.find({
//     "address.long": {
//       $gte: coordinate.longMinDegree,
//       $lte: coordinate.longMaxDegree,
//     },
//     "address.lat": {
//       $gte: coordinate.latMinDegree,
//       $lte: coordinate.latMaxDegree,
//     },
//   });
//   var success = false;
//   users.length > 0 ? (success = true) : (success = false);
//   res.json({ success, users, location });
// });

module.exports = router;
