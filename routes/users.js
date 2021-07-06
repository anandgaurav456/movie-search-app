const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");

// User Model
const User = require("../models/User");

// Login Home Page
router.get("/loginHome", (req, res) => {
  res.render("loginHome.ejs");
});

// Login page
router.get("/login", (req, res) => {
  res.render("login.ejs");
});

// Register Page
router.get("/register", (req, res) => {
  res.render("register.ejs");
});

// Resgitser Post request
router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;

  let errors = [];

  // Check for filled form
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Incomplete form" });
  }

  // Check both passwords correct
  if (password !== password2) {
    errors.push({ msg: "Passwords mismatch" });
  }

  // Password length
  if (password.length < 6) {
    errors.push({ msg: "Password should be atleast 6 characters" });
  }

  if (errors.length > 0) {
    res.render("register.ejs", { errors, name, email, password, password2 });
  } else {
    // Validation passed
    User.findOne({ email: email }).then((user) => {
      if (user) {
        // User exists
        errors.push({ msg: "Email already registered" });
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2,
        });
      } else {
        // New User
        const newUser = new User({
          name,
          email,
          password,
        });

        // Hash password
        bcrypt.hash(newUser.password, 10, function (err, hash) {
          // Store hash in your password DB.
          newUser.password = hash;
          newUser
            .save()
            .then((user) => {
              req.flash("success_msg", "You are now registered and can log in");
              res.redirect("/users/login");
            })
            .catch((err) => console.log(err));
        });
      }
    });
  }
});

// Login Post
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/users/login");
});

module.exports = router;
