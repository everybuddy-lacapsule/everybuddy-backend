var mongoose = require("mongoose");

var contentSchema = mongoose.Schema({
    name: String,
    content: String,
    dateSend: Date
});

var discussionSchema = mongoose.Schema({
  content: contentSchema,
});

var DiscussionModel = mongoose.model("discussions", discussionSchema);

module.exports = DiscussionModel;