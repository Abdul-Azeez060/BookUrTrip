const express = require("express");
const router = express.Router(); // router object
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../Controllers/user.js");
const wrapAsync = require("../utils/wrapAsync.js");

router
  .route("/signup")
  .get(userController.showSignUp)
  .post(wrapAsync(userController.signup));

router
  .route("/login")
  .get(userController.getLogin)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
      failureMessage: "Incorrect username or password",
    }),
    userController.login
  );

// logout
router.get("/logout", userController.logout);

module.exports = router;
