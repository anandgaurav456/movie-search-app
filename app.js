const express = require("express");
const colors = require("colors");
const request = require("request");
const mongoose = require("mongoose");
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");
const LocalStrategy = require("passport-local").Strategy;
require("dotenv").config();
/*
EJS is a simple templating language that lets you generate HTML markup with plain JavaScript.
No religiousness about how to organize things. 
No reinvention of iteration and control-flow. 
It's just plain JavaScript.
*/
app = express();
app.set("views engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

// Passport Config
require("./config/passport")(passport);

// Express session
app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
  })
);

// Connect flash
app.use(flash());

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));

// MongoDB Connection
const db = require("./config/keys").MongoURI;
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected DB".brightGreen.bold))
  .catch((err) => console.error.bind(console, "connection error:"));

app.listen(process.env.PORT, () => {
  console.log("Server is Starting...\n".brightGreen.bold);
});
