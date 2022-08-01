var mongoose = require("mongoose");
// Creation un schéma
var buddySchema = mongoose.Schema({
  idBuddy: String,
});

var BuddyModel = mongoose.model("buddies", buddySchema);
// Exportation ce module (ce ficier pour l’utilisation dans l’autre fichier)
module.exports = BuddyModel;
