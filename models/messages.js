var mongoose = require("mongoose");

var messageSchema = mongoose.Schema({
    discussionID: String,
    senderID: String,
    content: String,
    dateSend: Date,
});

var MessageModel = mongoose.model("messages", messageSchema);

module.exports = MessageModel;