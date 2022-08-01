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


router.get("/", async function (req, res, next) {
  let user = new UserModel ({
    admin: false,
    firstName: "Jonh",
    name: "Doe",
    email: "jg@gmail.com",
    pwd: "123",
    avatar: "",
    status: "",
    presentation: "",
    searchCurrent: "",
    tel: 623456789,
    nbBatch: 55,
    campus: "Lyon",
    cursus: "Dev web",
    address: "10 avenue de l'Europe, 69008",
    jobs: [],
    linkRs: [],
    tags: [{name: 'js', category: 'lang'}],
    buddies: [],
    discussion: [],
  });
  let newUserSaved = await user.save();

  res.render("index", { title: "Express" });
});

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

