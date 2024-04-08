const Review = require("../models/review");
const Listing = require("../models/listing");

module.exports.deleteReview = async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review deleted successfull");
  res.redirect(`/listings/${id}`);
};

module.exports.addNewReview = async (req, res) => {
  console.log(req.params.id);
  let listing = await Listing.findById(req.params.id);
  let review = req.body.review;

  const newReview = new Review(review);
  newReview.author = res.locals.currUser;
  console.log(newReview);
  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();
  console.log("rating saved");
  req.flash("success", "New review added!");
  res.redirect(`/listings/${listing._id}`);
};
