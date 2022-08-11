var express = require("express");
var router = express.Router();
var UserModel = require("../models/users");
const DiscussionModel = require("../models/discussions");

/*---POST: create a discussion for users if not exist---*/
router.post("/createDiscussion", async function (req, res, next) {
  console.log(req.body.senderID);
  console.log(req.body.receiverID);
  let discussion;
  try {
    if (req.body.senderID === req.body.receiverID) {
      discussion = await DiscussionModel.findOne({
        memberIDs: [req.body.senderID, req.body.receiverID],
      });
      // If discussion exist => send discussionID to Front
      console.log("Discussion", discussion);
    } else {
      // Find discussion in DB (WITHOUT regard to ORDER or other elements in the array by using $all operator)
      discussion = await DiscussionModel.findOne({
        memberIDs: { $all: [req.body.senderID, req.body.receiverID] },
      });
    }

    // If discussion exist => send discussionID to Front
    console.log("Discussion", discussion);
    if (discussion) {
      res.status(200).json(discussion._id);
      // Else => create a new discussion in DB THEN send discussionID to Front
    } else {
      const newDiscussion = new DiscussionModel({
        memberIDs: [req.body.senderID, req.body.receiverID],
      });
      const savedDiscussion = await newDiscussion.save();
      res.status(200).json(savedDiscussion._id);
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

/*---GET: find and send list discussions of user by userID---- */
router.get("/:userID", async function (req, res, next) {
  let userID = req.params.userID;
  if (userID) {
    try {
      let discussions = await DiscussionModel.find({
        memberIDs: { $in: [userID] },
      });
      res.status(200).json(discussions);
    } catch (error) {
      res.status(500).json(error);
    }
  }
});

module.exports = router;
