var express = require("express");
var router = express.Router();
var UserModel = require("../models/users");
//var BuddyModel = require("../models/buddies");

/* ----------------------PUT: update/add buddy in list buddies in DB------------------ */
router.put("/addBuddy", async (req, res, next) => {
  let success = false;
  try {
    let user = await UserModel.findOne({
      _id: req.body.userID,
    });
    
    let userBuddy = await UserModel.findOne({
      _id: req.body.userID,
      buddies: {$in: req.body.buddyID }
    })

    if (!userBuddy) {
      user.buddies.push(req.body.buddyID);
      // Save update buddies
      let userSaved = await user.save();
      if (userSaved) {
        // Get buddy infos (updated)
        let userBuddies = await UserModel.findOne({
          _id: req.body.userID,
        }).populate({
          path: "buddies",
          select:
            "name firstName avatar capsule.nbBatch work.work work.typeWork work.company",
        });
        success = true;
        res.status(200).json({ success, buddiesInfos: userBuddies.buddies });
      }
    }
    else{
      res.status(409).json({ success });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(success, error);
  }
});

/* ----------------------DELETE: delete buddie in DB------------------ */
router.delete("/deleteBuddy", async (req, res, next) => {
  let success = false;
  try {
    let update = await UserModel.findOneAndUpdate(
      { _id: req.body.userID },
      { $pull: { buddies: req.body.buddyID } }
    );
    console.log(update);

    let userUpdate = await UserModel.findOne({
      _id: req.body.userID,
    }).populate({
      path: "buddies",
      select:
        "name firstName avatar capsule.nbBatch work.work work.typeWork work.company",
    });

    success = true;
    res.status(200).json({ success, buddiesInfos: userUpdate.buddies });
  } catch (error) {
    res.status(500).json({ success, error });
  }
});

/* ----------------------GET: read buddie in DB------------------ */
router.get("/", async (req, res, next) => {
  let success = false;
  try {
    let user = await UserModel.findOne({
      _id: req.query.userID,
    }).populate({
      path: "buddies",
      select:
        "name firstName avatar capsule.nbBatch work.work work.typeWork work.company",
    });
    success = true;
    res.status(200).json({ success, buddiesInfos: user.buddies });
  } catch (error) {
    res.status(500).json(success, error);
  }
});
module.exports = router;
