var mongoose = require("mongoose");

/* ------------Sub-documents schema---------- */
var workSchema = mongoose.Schema({
  work: String,
  company: String,
  dateDebut: Date,
  typeWork: String,
});

var linkSchema = mongoose.Schema({
  linkedin: String,
  github: String,
});

var addressSchema = mongoose.Schema({
  long: Number,
  lat: Number,
  city: String,
  country: String
});

var tagSchema = mongoose.Schema({
  name: String,
});

var addressSchema = mongoose.Schema({
    long: Number,
    lat: Number,
    city: String,
    country: String
});

/* ------------Collection principal---------- */
var userSchema = mongoose.Schema({
  admin: Boolean,
  onboarding: false,
  firstName: String,
  name: String,
  email: String,
  pwd: String,
  avatar: String,
  status: String,
  presentation: String,
  searchCurrent: String,
  tel: Number,
  nbBatch: Number,
  campus: String,
  cursus: String,
  address: addressSchema,
  work: workSchema,
  linkRs: [linkSchema],
  tags: [tagSchema],
  buddies: [{ type: mongoose.Schema.Types.ObjectId, ref: "buddies" }],
  discussion: [{ type: mongoose.Schema.Types.ObjectId, ref: "discussions" }],
});

var UserModel = mongoose.model("users", userSchema);
// Exportation
module.exports = UserModel;