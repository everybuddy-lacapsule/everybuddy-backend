var mongoose = require('mongoose');

var options = {
    connectTimeoutMS: 5000,
    useUnifiedTopology : true,
    useNewUrlParser: true,
}

mongoose.connect('mongodb+srv://ThanhQui:zayyo8XP4c2NE2Ro@miam.crg9gau.mongodb.net/EveryBuddy?retryWrites=true&w=majority',
    options,
    function(err){
        console.log(err);
    }
);
