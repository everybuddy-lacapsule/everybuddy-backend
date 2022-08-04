var express = require("express");
var router = express.Router();
var UserModel = require("../models/users");
var DiscussionModel = require("../models/discussions");
var BuddyModel = require("../models/buddies");
const axios = require("axios");
require("dotenv").config();
const { API_MAP_TOKEN } = process.env;

var JobModel = require("../models/jobs");
var TagModel = require("../models/tags");

const calculRadius = (longDegree, latDegree, radius) => {
  let diffLongFr = Number(radius) * 0.054;
  let diffLatFr = Number(radius) * 0.009;
  let longMaxDegree = Number(longDegree) + diffLongFr;
  let longMinDegree = Number(longDegree) - diffLongFr;
  let latMaxDegree = Number(latDegree) + diffLatFr;
  let latMinDegree = Number(latDegree) - diffLatFr;
  return { longMaxDegree, longMinDegree, latMaxDegree, latMinDegree };
};

// Route Location in Search Bar
router.get("/searchByLocation", async (req, res, next) => {
  const params = {
    auth: API_MAP_TOKEN,
    locate: req.query.location,
    json: "1",
  };
  var location;
  await axios
    .get("https://geocode.xyz?region=FR", { params })
    .then((response) => {
      location = {
        long: Number.parseFloat(response.data.longt),
        lat: Number.parseFloat(response.data.latt),
      };
    })
    .catch((error) => {
      console.log(error);
    });
    console.log(location)
  //radius en km 
  let radius = 5;
  let coordinate = calculRadius(location.long, location.lat, radius);

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
  var success = false;
  users.length > 0 ? (success = true) : (success = false);
  res.json({ success, users, location });
});

router.post("/advancedSearch", async (req, res, next) => {
});

// Route Location in Onboarding
router.post("/addLocation", async (req, res, next) => {
  const params = {
    auth: API_MAP_TOKEN,
    locate: req.body.location,
    json: "1",
  };
  var location;
  await axios
    .get("https://geocode.xyz?region=FR", { params })
    .then((response) => {
      location = {
        long: response.data.longt,
        lat: response.data.latt,
        city: response.data.standard.city,
        country: response.data.standard.prov,
      };
      res.json(location);
    })
    .catch((error) => {
      console.log(error);
    });
  await UserModel.updateOne(
    { _id: req.body.id },
    {
      address: location,
    }
  );
});

// Route Location in Search Bar
router.get("/advancedSearch", async (req, res, next) => {
  var locationRequest = 'lyon'
  if(req.query.location) {
    locationRequest = req.query.location;
  };
  var radius = 1000
  if(req.query.radius) {
    radius = req.query.radius;
  };

  const params = {
    auth: API_MAP_TOKEN,
    locate: locationRequest,
    json: "1",
  };
  var location;
  await axios
    .get("https://geocode.xyz?region=FR", { params })
    .then((response) => {
      location = {
        long: Number.parseFloat(response.data.longt),
        lat: Number.parseFloat(response.data.latt),
      };
    })
    .catch((error) => {
      console.log(error);
    });

  //radius en km 
  let coordinate = calculRadius(location.long, location.lat, radius);
  // default batch treatment
  var nbBatch = req.query.nbBatch
  if (!req.query.nbBatch){
    nbBatch = {$gte: 1
    }
  }
  // default cursus treatment
  var cursus = req.query.cursus
  if (!req.query.cursus){
    cursus = ['Fullstack', 'DevOps', 'Code for business']
    
  }
  // default campus treatment
  var campus = req.query.campus
  if (!req.query.campus){
    campus = ['Paris', 
    'Lyon', 
    'Marseille', 
    'Nice', 
    'Lille', 
    'Bordeaux',
    'Bruxelles',
    'Monaco']
    
  }

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
  });
  var success = false;
  users.length > 0 ? (success = true) : (success = false);
  res.json({ success, users, location });
});

module.exports = router;
