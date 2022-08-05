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
  let longMaxDegree = longDegree + diffLongFr;
  let longMinDegree = longDegree - diffLongFr;
  let latMaxDegree = latDegree + diffLatFr;
  let latMinDegree = latDegree - diffLatFr;
  return { longMaxDegree, longMinDegree, latMaxDegree, latMinDegree };
};

<<<<<<< HEAD
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
=======

>>>>>>> 2dda0aabec711e83c848671ecccc0671fa0e7d8c

// Route Location in Onboarding
router.post("/addLocation", async (req, res, next) => {
  var location
  const response = await geocoder.geocode(req.body.location);
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

// Route search
router.post("/search", async (req, res, next) => {
<<<<<<< HEAD
  var locationRequest = req.body.location
  if(!req.body.location) {
    locationRequest = 'bourges, 18000';
  };
=======
  // INIT variable de response (location)
  var location

  // default radius treatment
>>>>>>> 2dda0aabec711e83c848671ecccc0671fa0e7d8c
  var radius = req.body.radius
  if(!req.body.radius) {
    radius = 400;
  };
  if (req.body.radius===100){
    radius = 400;
    location = {
      long: 2.4302,
      lat: 46.536,
      radius: radius,
      locationRequest : 'Toute la France',
    };
  }
  // default location request treatment
  var locationRequest = req.body.location
  if(!req.body.location) {
    location = {
      long: 2.4302,
      lat: 46.536,
      radius: radius,
      locationRequest : 'Toute la France',
    };
  };
  // default cursus treatment
  var cursus = req.body.cursus
  if (req.body.cursus.length<1){
    cursus = ['Fullstack', 'DevOps', 'Code for business']
  }
  // default campus treatment
  var campus = req.body.campus
  if (req.body.campus.length<1){
    campus = ['Paris', 
    'Lyon', 
    'Marseille', 
    'Nice', 
    'Lille', 
    'Bordeaux',
    'Bruxelles',
    'Monaco']
  }
  // default work treatment
  var work = req.body.work
  if (req.body.work.length<1){
    work = ['Développeur',
      'Product Owner',
      'Data Scientist',
      'DevOps',
      'Scrum Master']
  }
  // default typeWork treatment
  var typeWork = req.body.workType
  if (req.body.workType.length<1){
    typeWork = [
      'Entrepreneur',
      'En contrat',
      'Freelance',
      'En recherche',
    ]
  }
  // default tags treatment
  var tags = req.body.tags
  console.log(tags)
  if (req.body.tags.length<1){
    tags = 
    ['Frontend', 
    'Backend', 
    'FullStack', 
    'JavaScript', 
    'AngularJS',
    'ReactJS', 
    'VueJS', 
    'TypeScript', 
    'ReactNative', 
    'Swift', 
    'Kotlin', 
    'Flutter', 
    'BDD', 
    'API', 
    'Java', 
    'Python', 
    'PHP'
  ]
  }
  // default status treatment
  var status = req.body.status
  if (req.body.status.length<1){
    status = ['#OPEN TO WORK', '#HIRING', '#PARTNER', '#JUST CURIOUS']
  }
  // default batch treatment
  var nbBatch = req.body.nbBatch
  if (!req.body.nbBatch){
    nbBatch = {$gte: 1
    }
  }
  // appel de geocode api (google)
  if (!location){
    const response = await geocoder.geocode(locationRequest);
    location = {
      long: Number.parseFloat(response[0].longitude),
      lat: Number.parseFloat(response[0].latitude),
      radius: radius,
      locationRequest : locationRequest,
    };
  }
  
  //radius en km 
  let coordinate = calculRadius(location.long, location.lat, location.radius);

  
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
    tags: {$in: tags},
    status: status,
  });
  console.log(users)
  var success = false;
  users.length > 0 ? (success = true) : (success = false);
  res.json({ success, users, location, cursus, campus, status, tags, work, typeWork });
});

// Route Location in Search Bar - POUR LE DOSSIER : 1ere route searchByLocation avant implementation search avancee
// router.get("/searchByLocation", async (req, res, next) => {
//   var location
//   const response = await geocoder.geocode(req.query.location);
//   location = {
//     long: Number.parseFloat(response[0].longitude),
//     lat: Number.parseFloat(response[0].latitude)
//   };

//   //radius en km 
//   let radius = 5;
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