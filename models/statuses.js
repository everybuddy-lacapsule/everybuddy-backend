var mongoose = require("mongoose");

var statusSchema = mongoose.Schema({
    statuses: Object
});

var StatusModel = mongoose.model("statuses", statusSchema);

module.exports = StatusModel;