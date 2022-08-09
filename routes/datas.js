var express = require("express");
var router = express.Router();
const TagModel = require("../models/tags");
const StatusModel = require("../models/statuses");
const JobModel = require("../models/jobs");
const TypeJobsModel = require("../models/typeJobs");

/*--------------GET All Tags in DB -------------- */
router.get("/tags", async (req, res, next) => {
  try {
    const tags = await TagModel.find();
    const allTags = [];
    tags.forEach((tag) => {
      allTags.push(tag["name"]);
    });
    res.status(200).json(allTags);
  } catch (error) {
    res.status(500).json(error);
  }
});

/*--------------GET All Status in DB -------------- */
router.get("/statuses", async (req, res, next) => {
  try {
    const statuses = await StatusModel.find();
    const allStatuses = statuses[0].statuses;
    res.status(200).json(allStatuses);
  } catch (error) {
    res.status(500).json(error);
  }
});

/*--------------GET All Jobs in DB -------------- */
router.get("/jobs", async (req, res, next) => {
  try {
    const jobs = await JobModel.find();
    const allJobs = jobs[0].jobs;
    res.status(200).json(allJobs);
  } catch (error) {
    res.status(500).json(error);
  }
});

/*--------------GET All TypeJobs in DB -------------- */
router.get("/typeJobs", async (req, res, next) => {
  try {
    const typeJobs = await TypeJobsModel.find();
    const allTypeJobs = typeJobs[0].typeJobs;
    res.status(200).json(allTypeJobs);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;