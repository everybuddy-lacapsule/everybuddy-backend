var express = require("express");
var router = express.Router();
var UserModel = require("../models/users");
var DiscussionModel = require("../models/discussions");
var BuddyModel = require("../models/buddies");
const axios = require("axios");
require("dotenv").config();
const { API_MAP_TOKEN } = process.env;
const NodeGeocoder = require('node-geocoder');
const options = {
  provider: 'google',

  // Optional depending on the providers
  apiKey: API_MAP_TOKEN,
  formatter: null // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(options);
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
  var location
  const response = await geocoder.geocode(req.query.location);
  location = {
    long: Number.parseFloat(response[0].longitude),
    lat: Number.parseFloat(response[0].latitude)
  };
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

// Route Location in Onboarding
router.post("/addLocation", async (req, res, next) => {
  var location
  const response = await geocoder.geocode(req.query.location);
  location = {
    long: Number.parseFloat(response[0].longitude),
    lat: Number.parseFloat(response[0].latitude)
  };

  await UserModel.updateOne(
    { _id: req.body.id },
    {
      address: location,
    }
  );
});

// Route Location in Search Bar
router.post("/search", async (req, res, next) => {
  var locationRequest = req.query.location
  if(!req.query.location) {
    locationRequest = 'bourges, 18000';
  };
  var radius = req.query.radius
  if(!req.query.radius) {
    radius = 1000;
  };

  var location
  const response = await geocoder.geocode(locationRequest);
  location = {
    long: Number.parseFloat(response[0].longitude),
    lat: Number.parseFloat(response[0].latitude),
    radius: radius
  };
  console.log(location)

  //radius en km 
  let coordinate = calculRadius(location.long, location.lat, location.radius);
  // default batch treatment
  var nbBatch = req.query.nbBatch
  if (!req.query.nbBatch){
    nbBatch = {$gte: 1
    }
  }
  // default cursus treatment
  var cursus = ['Fullstack', 'DevOps', 'Code for business']
  if (req.query.cursus){
    var cursus = req.query.cursus
  }
  // default campus treatment
  campus = ['Paris', 
  'Lyon', 
  'Marseille', 
  'Nice', 
  'Lille', 
  'Bordeaux',
  'Bruxelles',
  'Monaco']
  if (req.query.campus){
    var campus = req.query.campus
  }
  // default work treatment
  work = ['Développeur',
  'Product Owner',
 'Data Scientist',
 'DevOps',
 'Scrum Master']
  if (req.query.work){
    var work = req.query.work
  }
  // default typeWork treatment
  typeWork = [
    'Entrepreneur',
    'En contrat',
    'Freelance',
    'En recherche',
  ]
  if (req.query.typeWork){
    var typeWork = req.query.typeWork
  }
  // default tags treatment
  tags = 'Frontend, Backend, FullStack, JavaScript, AngularJS, ReactJS, VueJS, TypeScript, ReactNative, Swift , Kotlin, Flutter, BDD, API, Java, Python, PHP'
  if (req.query.tags){
    var tags = req.query.tags
  }
  // default status treatment
  status = ['#OPEN TO WORK', '#HIRING', '#PARTNER', '#JUST CURIOUS']
  if (req.query.status){
    var status = req.query.status
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
    "work.work": work,
    "work.typeWork": typeWork,
    tags: {$in: tags.split(', ')},
    status: status,
  });
  var success = false;
  users.length > 0 ? (success = true) : (success = false);
  res.json({ success, users, location, cursus, campus, status, tags, work, typeWork });
});

module.exports = router;