var mongoose = require("mongoose");

/* ------------Sub-documents schema---------- */
var postSchema = mongoose.Schema({
    post: String,
    company: String,
    dateDebut: Date,
    typePost: String
});

var linkSchema = mongoose.Schema({
    linkedin: String,
    github: String
});

var tagSchema =  mongoose.Schema({
    linkedin: String,
    github: String
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
    post: postSchema,
    linkRs: [linkSchema],
    tags: [tagSchema],
    buddies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'buddies' }],
    discussion: [{ type: mongoose.Schema.Types.ObjectId, ref: 'discussions' }],
})

var UserModel = mongoose.model('users', userSchema)
// Exportation
module.exports = UserModel;

