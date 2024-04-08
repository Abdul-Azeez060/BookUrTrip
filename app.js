// if (process.env.NODE_ENV != "production") {
//   require("dotenv").config();
// }
require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const { wrap } = require("module");

const listingsRoute = require("./routes/listing.js");
const reviewsRoute = require("./routes/review.js");
const userRoute = require("./routes/user.js");

const session = require("express-session"); // session is a middleware
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("X-HTTP-Method-Override"));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const atlasdb = process.env.ATLAS_DB;
main()
  .then((res) => console.log("connection to database successfull"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(atlasdb);
}

const port = 8080;

const store = MongoStore.create({
  mongoUrl: atlasdb,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600, // time period in seconds
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() * 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); // adding the user data to session
passport.deserializeUser(User.deserializeUser()); // removing the user data from the session

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

//routes
app.use("/listings", listingsRoute);
app.use("/listings/:id/reviews", reviewsRoute);
app.use("/", userRoute);

//demo user
app.get("/demouser", async (req, res) => {
  let user = new User({
    email: "abdul@gmail.com",
    username: "abdul_007",
  });
  let registeredUser = await User.register(user, "helloworld"); // adding this user's data to User model
  res.send(registeredUser);
});

app.all("*", async (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

//error handling middleware
app.use((err, req, res, next) => {
  let { status = 500, message = "Something went wrong" } = err;
  res.status(status).render("./listings/Error.ejs", { message });
});

app.get("/", (req, res) => {
  res.send("received the get request");
});

app.listen(port, () => {
  console.log("server is listening at 8080");
});
