var express = require("express");
var router = express.Router();
var UserModel = require("../models/users");

/*---POST: find and send list discussions of user by userID---- */
router.post("/displayDiscussions", async function (req, res, next) {
  let user = await UserModel.findOne({
    _id: req.body.userID,
  });
  let discussions = user.discussion;
  console.log(user.discussion);


  res.json(discussions);
});

module.exports = router;
