var mongoose = require("mongoose");

var discussionSchema = mongoose.Schema({
    memberIDs: Array,
});

var DiscussionModel = mongoose.model("discussions", discussionSchema);

module.exports = DiscussionModel;