var mongoose = require("mongoose");

var jobSchema = mongoose.Schema({
    name: String    
});

var JobModel = mongoose.model("jobs", jobSchema);

module.exports = JobModel;