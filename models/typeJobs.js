var mongoose = require("mongoose");

var typeJobsSchema = mongoose.Schema({
  typeJobs: Object,
});

var TypeJobsModel = mongoose.model("typeJobs", typeJobsSchema);

module.exports = TypeJobsModel;
