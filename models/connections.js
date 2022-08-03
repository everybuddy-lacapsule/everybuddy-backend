require("dotenv").config();
const mongoose = require("mongoose");

const { DB_LOGIN, DB_PWD, DB_HOSTNAME, DB_NAME } = process.env;

const options = {
  connectTimeoutMS: 5000,
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

mongoose.connect(
  `mongodb+srv://${DB_LOGIN}:${DB_PWD}@${DB_HOSTNAME}/${DB_NAME}?retryWrites=true&w=majority`,
  options,
  function (err) {
    console.log(err);
  }
);
