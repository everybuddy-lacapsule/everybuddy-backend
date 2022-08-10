var mongoose = require("mongoose");

/* ------------Sub-documents schema---------- */
var capsuleSchema = mongoose.Schema({
  nbBatch: Number,
  campus: String,
  cursus: String,
});

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

/* ------------Collection principal---------- */
var userSchema = mongoose.Schema({
  admin: Boolean,
  onboarding: Boolean,
  firstName: String,
  name: String,
  email: String,
  pwd: String,
  avatar: String,
  status: String,
  presentation: String,
  searchCurrent: String,
  tel: Number,
  capsule: capsuleSchema,
  address: addressSchema,
  work: workSchema,
  linkRs: linkSchema,
  tags: Array,
  buddies: Array,
});

var UserModel = mongoose.model("users", userSchema);
// Exportation
module.exports = UserModel;