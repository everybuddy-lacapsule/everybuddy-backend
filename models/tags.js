var mongoose = require("mongoose");

var tagSchema = mongoose.Schema({
    name: String    
});

var TagModel = mongoose.model("tags", tagSchema);

module.exports = TagModel;