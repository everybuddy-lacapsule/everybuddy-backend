var mongoose = require('mongoose');

var options = {
    connectTimeoutMS: 5000,
    useUnifiedTopology : true,
    useNewUrlParser: true,
}

mongoose.connect('mongodb+srv://everybuddy:mukm1MT8a3wIAqT3@everybuddy.z8bet.mongodb.net/everybuddy?retryWrites=true&w=majority',
    options,
    function(err){
        console.log(err);
    }
);
