var mongoose = require("mongoose");
// Creation un schéma
var userTokenSchema = mongoose.Schema({
  userID: String,
  userToken: String,
});

var UserTokenModel = mongoose.model("userTokens", userTokenSchema);
// Exportation ce module (ce ficier pour l’utilisation dans l’autre fichier)
module.exports = UserTokenModel;
