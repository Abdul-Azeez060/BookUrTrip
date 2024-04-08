const express = require("express");
const app = express();
const session = require("express-session"); // session is a middleware
const flash = require("connect-flash");
const path = require("path");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const sessionOptions = {
  secret: "mysupersecretstirng",
  resave: false,
  saveUninitialized: true,
};

app.use(session(sessionOptions));
app.use(flash());
app.use((req, res, next) => {
  res.locals.successMsg = req.flash("success");
  res.locals.errorMsg = req.flash("error");
  next();
});

app.use();

app.get("/getcount", (req, res) => {
  if (req.session.count) {
    req.session.count++;
  } else {
    req.session.count = 1;
  }
  res.send(`you visited this ${req.session.count} times`);
});

app.get("/register", (req, res) => {
  let { name = "Azeez" } = req.query;
  req.session.name = name;

  if (name === "Azeez") {
    req.flash("error", "name not registered");
  } else {
    req.flash("success", "name registered successfully");
  }
  res.redirect("/hello");
});

app.get("/hello", (req, res) => {
  let name = req.session.name;
  console.log(name);

  res.render("page.ejs", { name });
});

app.get("/", (req, res) => {
  res.send("this is a root");
});

app.listen(3000, () => {
  console.log("server is listening");
});
