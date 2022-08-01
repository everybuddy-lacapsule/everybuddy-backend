var mongoose = require("mongoose");

var newSchema = mongoose.Schema({
    author: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
    title: String,
    content: String,
    img: String,
    url: String,
    datePub: Date,
    event: Boolean,
    dateEvent: Date,
    location: String
});

var NewModel = mongoose.model("news", newSchema);

module.exports = NewModel;