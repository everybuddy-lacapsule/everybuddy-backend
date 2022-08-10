var express = require("express");
var router = express.Router();
var UserModel = require("../models/users");
//var BuddyModel = require("../models/buddies");

/* ----------------------PUT: update/add buddy in list buddies in DB------------------ */
router.put("/addBuddy", async (req, res, next) => {
  try {
    let user = await UserModel.findOne({
      _id: req.body.userID,
    });
    user.buddies.push(req.body.buddyID);
    let userSaved = await user.save();

    // let newBuddy = new BuddyModel({ buddyID: req.body.buddyID });
    res.status(200).json(userSaved);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

/* ----------------------DELETE: delete buddie in DB------------------ */
router.delete("/deleteBuddy", async (req, res, next) => {
  let listInfosBuddies = [];
  let buddyInfos = {};
  try {
    let update = await UserModel.findOneAndUpdate(
      { _id: req.body.userID },
      { $pull: { buddies: req.body.buddyID } }
    )
      .then((response) => console.log(response))
      .catch((err) => console.log("Error", err));

    let updateSaved = update.save();
    console.log(updateSaved);
    /*
    if (updateSaved.modifiedCount > 0) {
      let user = await UserModel.findOne({
        _id: req.query.userID,
      });

      for (let i = 0; i < user.buddies.length; i++) {
        console.log(user.buddies);
        let buddy = await UserModel.findOne({ _id: user.buddies[i]._id });

        buddyInfos = {
          buddyID: buddy._id,
          name: buddy.name,
          firstName: buddy.firstName,
          nbBatch: buddy.capsule.nbBatch,
          work: buddy.work.work,
          company: buddy.work.company,
          typeWork: buddy.work.typeWork,
        };
        listInfosBuddies.push(buddyInfos);
      }
    }
    */
    res.status(200).json(updateSaved);
  } catch (error) {
    res.status(500).json(error);
  }
});

/* ----------------------GET: read buddie in DB------------------ */
router.get("/", async (req, res, next) => {
  try {
    let user = await UserModel.findOne({
      _id: req.query.userID,
    }).populate({
      path: "buddies",
      select:
        "name firstName capsule.nbBatch work.work work.typeWork work.company",
    });

    res.status(200).json(user.buddies);
  } catch (error) {
    res.status(500).json(error);
  }
});
module.exports = router;

//const listBuddies = user.buddies;
/*
     
*/
/*
      let buddyInfos = {
      buddyID: req.body.buddyID,
      name: buddy.name,
      firstName: buddy.firstName,
      nbBatch: buddy.capsule.nbBatch,
      work: buddy.work.work,
      company: buddy.work.company,
      typeWork: buddy.work.typeWork,
    };

    const newBuddy = new BuddyModel(buddyInfos);
    let newBuddySaved = await newBuddy.save();

    console.log(buddyInfos);
      */
