var express = require("express");
var router = express.Router();
var UserModel = require("../models/users");
const MessageModel = require("../models/messages");

/*---GET: find and send list messages of user by discussionID---- */
router.get("/:discussionID", async function (req, res, next) {
  let discussionID = req.params.discussionID;
  if (discussionID) {
    try {
      let messages = await MessageModel.find({ discussionID: discussionID });

      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json(error);
    }
  }
});

/*---GET: find and send  last message by discussionID---- */
router.get("/:discussionID/lastMessage", async function (req, res, next) {
  let discussionID = req.params.discussionID;
  if (discussionID) {
    try {
      let messages = await MessageModel.find({
        discussionID: discussionID,
      }).sort({ dateSend: -1 });
      res.status(200).json(messages[0]);
    } catch (error) {
      res.status(500).json(error);
    }
  }
});

/*---POST: save message in DB by discussionID, userID---- */
router.post("/addMessage", async function (req, res, next) {
  if (req.body.discussionID) {
    try {
      const newMessageAdded = new MessageModel({
        discussionID: req.body.discussionID,
        senderID: req.body.userID,
        content: req.body.message,
        dateSend: Date.now(),
      });
      const savedMessage = await newMessageAdded.save();
      console.log(savedMessage);
      res.status(200).json(savedMessage);
    } catch (error) {
      res.status(500).json(error);
    }
  }
});

/*---GET: send a default message (ProfilScreen)---- */



module.exports = router;
