const express = require("express");
const router = express.Router({ mergeParams: true }); // router object
const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview, isAuthor } = require("../middleware.js");
const isLoggedin = require("../middleware.js");
const reviewController = require("../Controllers/review.js");

//delete review
router.delete(
  "/:reviewId",
  isLoggedin,
  isAuthor,
  wrapAsync(reviewController.deleteReview)
);

// adding new review
router.post(
  "/",
  isLoggedin,
  validateReview,
  wrapAsync(reviewController.addNewReview)
);

module.exports = router;
