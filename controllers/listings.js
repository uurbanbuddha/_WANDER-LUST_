/* LISTING MODEL */
const Listing = require("../models/listing.js");

/* MAP BOX SDK */
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');

/* MAP ACCESS TOKEN */
const mapToken = process.env.MAP_TOKEN;

/* BASE CLIENT */
const geocodingClient = mbxGeocoding({ accessToken: mapToken });



/* INDEX CONTROLLER */
module.exports.index = async (req, res) => {

    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

/* NEW LISTING CONTROLLER */
module.exports.new = (req, res) => {

    res.render("listings/new.ejs");
};

/* SHOW LISTING CONTROLLER */
module.exports.show = async (req, res) => {

    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            }
        })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
        /* throw new ExpressError(404, "Listing Not Found"); */
    }
    console.log(listing)
    res.render("listings/show.ejs", { listing });

};

/* CREATE NEW LISTING CONTROLLER */
module.exports.create = async (req, res) => {
    /* if(!req.body.listing){
        throw new ExpressError(400, "Send Valid Data For Listing")
    } */


    /* if(!newListing.description){
        throw new ExpressError(400, "Description is Missing")
    }

    if(!newListing.location){
        throw new ExpressError(400, "Location is Missing")
    } */
    /* let result = listingSchema.validate(req.body)
    if(result.error){
        throw new ExpressError(400, result.error)
    } */
    /* GEO CODING */

    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
    })
        .send();

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.geometry = response.body.features[0].geometry;

    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "New Listing Added");
    res.redirect("/listings");

};

/* EDIT LISTING CONTROLLER */
module.exports.edit = async (req, res) => {

    let { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
        /* throw new ExpressError(404, "Listing Not Found"); */
    }
    let originalUrl = listing.image.url;
    let newUrl = originalUrl.replace("/upload", "/upload/h_300,w_500")
    res.render("listings/edit.ejs", { listing, newUrl });

};

/* UPDATE LISTING CONTROLLER */
module.exports.update = async (req, res) => {

    let { id } = req.params;

    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
    })
        .send();

        let listing = await Listing.findById(id);

        listing.geometry = response.body.features[0].geometry;

     listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing, geometry: listing.geometry }, { new: true });//spread operator



    if (typeof req.file !== "undefined") {

        let url = req.file.path;

        let filename = req.file.filename;

        listing.image = { url, filename };

        await listing.save();
    };




    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);

};

/* DELETE LISTING CONTROLLER */
module.exports.delete = async (req, res) => {

    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");

};

/* PRIVACY ROUTE */
module.exports.privacy = async (req, res) => {
    res.render("listings/privacy.ejs");
};

/* TERMS ROUTE */
module.exports.terms = async (req, res) => {
    res.render("listings/terms.ejs");
};

/* CONSTRUCTION ROUTE */
module.exports.construction = async (req, res) => {
    res.render("listings/construction.ejs");
};