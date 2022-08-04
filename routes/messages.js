var express = require("express");
var router = express.Router();
var UserModel = require("../models/users");
const MessageModel = require("../models/messages");

/*---POST: create a message for users---*/
router.post("/", async function (req, res, next) {
  const newMessage = new MessageModel({
    discussionID: req.body.discussionID,
    senderID: req.body.senderID,
    content: req.body.content,
    dateSend: Date.now(),
  });

  try {
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (error) {
    res.status(500).json(error);
  }
});

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
      let messages = await MessageModel.find({ discussionID: discussionID }).sort({ dateSend: -1 });

      //let lastMessage = messages;

      res.status(200).json(messages[0]);
    } catch (error) {
      res.status(500).json(error);
    }
  }
});

router.post("/addMessage", async function (req,res, next){

let discID = req.body.discussionID;
 console.log('backid',req.body.discussionID)
})

module.exports = router;
