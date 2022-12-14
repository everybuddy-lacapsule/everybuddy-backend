var fileUpload = require('express-fileupload');
require("./models/connections"); // BDD
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var dbRouter = require("./routes/dbcreate");
var discussionsRouter = require("./routes/discussions");
const messagesRouter = require("./routes/messages");
const datasRouter = require("./routes/datas");
const buddiesRouter = require("./routes/buddies");

var app = express();

// view engine setup
app.use(fileUpload());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/dbcreate", dbRouter);
app.use("/users", usersRouter);
app.use("/discussions", discussionsRouter);
app.use("/messages", messagesRouter);
app.use("/datas", datasRouter);
app.use("/buddies", buddiesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
