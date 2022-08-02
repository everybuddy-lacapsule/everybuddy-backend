var express = require("express");
var router = express.Router();
var UserModel = require("../models/users");
var DiscussionModel = require("../models/discussions");
var BuddyModel = require("../models/buddies");
const axios = require('axios');

var JobModel = require("../models/jobs");
var TagModel = require("../models/tags");

const calculRadius = (longDegree, latDegree, radius) => {
  let diffLongFr = Number(radius)*0.054;
  let diffLatFr = Number(radius)*0.009;
  let longMaxDegree = Number(longDegree) + diffLongFr;
  let longMinDegree = Number(longDegree) - diffLongFr;
  let latMaxDegree = Number(latDegree) + diffLatFr;
  let latMinDegree = Number(latDegree) - diffLatFr;
  return {longMaxDegree, longMinDegree, latMaxDegree, latMinDegree}
};

// Route Location in Search Bar
router.get("/searchByLocation", async(req, res, next) => {
  const params = {
    auth: '138947957945081132130x13101',
    locate: req.query.location,
    json: '1'
  }
  var location
  await axios.get('https://geocode.xyz?region=FR',{params})
    .then(response => {
      location = {long: response.data.longt, lat: response.data.latt}
    }).catch(error => {
      console.log(error);
    });
  
  // On crée un radius de 10km autour du point de recherche 
  // voir fonction en haut du fichier
  let radius = 10;
  let coordinate = calculRadius(location.long, location.lat, radius);

 
  var users = await UserModel.find({'address.long':{$gte : coordinate.longMinDegree, $lte: coordinate.longMaxDegree}, 'address.lat': {$gte : coordinate.latMinDegree, $lte: coordinate.latMaxDegree}})

 console.log(users)
var success = false;
 users.length>0 ? success=true : success=false;
 res.json({success, users, location})
});

// Route Location in Onboarding
router.post("/addLocation", async (req, res, next) => {
  const params = {
    auth: '138947957945081132130x13101',
    locate: req.body.location,
    json: '1'
  }
  var location
  await axios.get('https://geocode.xyz?region=FR',{params})
    .then(response => {
      location = {long: response.data.longt, lat: response.data.latt, city: response.data.standard.city, country: response.data.standard.prov }
     res.json(location)
      console.log(location)
      //res.json(location)
    }).catch(error => {
      console.log(error);
    });
    await UserModel.updateOne(
      { _id: req.body.id},{
        address: location
      });

});

module.exports = router;
