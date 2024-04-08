const User = require("../models/user");

module.exports.showSignUp = (req, res) => {
  res.render("./users/signup.ejs");
};

module.exports.signup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    let user = new User({
      username,
      email,
    });
    const registeredUser = await User.register(user, password);
    console.log(registeredUser);
    req.logIn(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to WanderLust");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.getLogin = (req, res) => {
  res.render("./users/login.ejs");
};

module.exports.login = (req, res) => {
  req.flash("success", "Welcome back!");
  let url = res.locals.redirectUrl || "/listings";
  return res.redirect(url);
};

module.exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      req.flash("error", "Logout unsuccessfull");
      next(err);
    }
    req.flash("success", "logout successfull");
    res.redirect("/listings");
  });
};
