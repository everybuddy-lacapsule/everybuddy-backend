var express = require("express");
var router = express.Router();
var UserModel = require("../models/users");
var DiscussionModel = require("../models/discussions");
var BuddyModel = require("../models/buddies");
const axios = require('axios');
/* GET home page. */
/*
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});
 */
var JobModel = require("../models/jobs");
var TagModel = require("../models/tags");



module.exports = router;

router.get("/searchByLocation",(req, res, next) => {
  const params = {
    auth: '138947957945081132130x13101',
    locate: req.query.location,
    json: '1'
  }
  
  axios.get('https://geocode.xyz?region=FR',{params})
    .then(response => {
      var location = {long: response.data.longt, lat: response.data.latt, city: response.data.standard.city, country: response.data.standard.prov }
      res.json(location);
    }).catch(error => {
      console.log(error);
    });  
 
});

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
    // var update = await UserModel.updateOne(
    //    { _id: req.body.id},
    //   { address: [loca] }
    // );

});

