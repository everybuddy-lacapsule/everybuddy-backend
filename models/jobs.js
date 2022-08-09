var mongoose = require("mongoose");

var jobSchema = mongoose.Schema({
    jobs: Object    
});

var JobModel = mongoose.model("jobs", jobSchema);

module.exports = JobModel;