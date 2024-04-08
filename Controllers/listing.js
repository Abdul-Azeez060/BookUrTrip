const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const MY_ACCESS_TOKEN = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: MY_ACCESS_TOKEN });
// const tilesetsService = mbxTilesets(baseClient);

module.exports.index = async (req, res) => {
  let listings = await Listing.find();
  res.render("./listings/index.ejs", { listings });
};

module.exports.renderNewForm = (req, res) => {
  console.log(req.user);
  res.render("./listings/newListings.ejs");
};

module.exports.renderEditListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing does not exists");
    res.redirect("/listings");
    return;
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_200");
  res.render("./listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.editListing = async (req, res, next) => {
  let { id } = req.params;
  if (!req.body.listing) {
    next(new ExpressError(400, "Please send a valid data"));
  }
  // console.log(req.body.listing);
  let editedListing = req.body.listing;
  console.log(editedListing);
  // console.log(editedListing);
  let listing = await Listing.findByIdAndUpdate(id, editedListing);
  if (req.file) {
    console.log(req.file);
    let url = req.file.path;
    console.log(url);
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "listing updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted successfull");
  res.redirect("/listings");
};

module.exports.showListing = async (req, res, next) => {
  let { id } = req.params;
  if (id.toString().length != 24) {
    return next(new ExpressError(400, "listing does not exists"));
  }
  let listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing does not exists");
    res.redirect("/listings");
    return;
  }
  res.render("./listings/show.ejs", { listing });
};

module.exports.addNewListing = async (req, res, next) => {
  //   let { title, description, image, price, country } = req.body;
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  let url = req.file.path;
  let filename = req.file.filename;
  const newlisting = new Listing(req.body.listing);
  newlisting.owner = req.user._id;
  newlisting.image = { url, filename };
  newlisting.geometry = response.body.features[0].geometry;
  let savedListing = await newlisting.save();
  console.log(savedListing);
  req.flash("success", "New listing added!");
  res.redirect("/listings");
};
