const express = require("express");
const router = express.Router(); // router object
const wrapAsync = require("../utils/wrapAsync.js");
const isLoggedin = require("../middleware.js");
const { isOwner } = require("../middleware.js");
const { validateListing } = require("../middleware.js");
const listingController = require("../Controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// middleware

//listings
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedin,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.addNewListing)
  );

// new listing
router.get("/new", isLoggedin, listingController.renderNewForm);

//edit show listing
router.get(
  "/:id/edit",
  isLoggedin,
  isOwner,
  wrapAsync(listingController.renderEditListing)
);

// Edit route
//delete route
// Show route
router
  .route("/:id")
  .put(
    isLoggedin,
    upload.single("listing[image]"),
    validateListing,
    isOwner,
    wrapAsync(listingController.editListing)
  )
  .delete(isLoggedin, isOwner, wrapAsync(listingController.deleteListing))
  .get(wrapAsync(listingController.showListing));

module.exports = router;
