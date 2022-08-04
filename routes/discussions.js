var express = require("express");
var router = express.Router();
var UserModel = require("../models/users");
const DiscussionModel = require("../models/discussions");

/*---POST: create a discussion for users---*/
router.post('/', async function(req, res, next){
    const newDiscussion = new DiscussionModel({
      memberIDs: [req.body.senderID, req.body.receiverID]
    });
  
    try {
      const savedDiscussion = await newDiscussion.save();
      res.status(200).json(savedDiscussion);
    } catch (error) {
      res.status(500).json(error);
    }
    
  });

/*---GET: find and send list discussions of user by userID---- */
router.get("/:userID", async function (req, res, next) {
  let userID = req.params.userID;
  if (userID) {
    try {
      let discussions = await DiscussionModel.find(
        {memberIDs: {$in: [userID] }}
      );
      console.log(discussions);
      res.status(200).json(discussions);

    } catch (error) {
      res.status(500).json(error);
    }
  }
});

module.exports = router;
