var mongoose = require("mongoose");
// Creation un schéma
var userDeviceTokenSchema = mongoose.Schema({
  userID: String,
  deviceToken: String,
});

var UserDeviceTokenModel = mongoose.model("userDeviceTokens", userDeviceTokenSchema);
// Exportation ce module (ce ficier pour l’utilisation dans l’autre fichier)
module.exports = UserDeviceTokenModel;
