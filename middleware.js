const Listing = require("./models/listing");//listing model

const ExpressError = require("./utils/ExpressError.js");

const { listingSchema, reviewSchema } = require('./schema.js');//
const Review = require("./models/review.js");

/* Login Middelware */
module.exports.isLoggedIn = (req, res, next) =>{
     /* console.log(req.path, "..", req.originalUrl); */ 
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "Please login");
        return res.redirect("/login");
    }
    next();
};
/* req contaions a session object; in that we created a new object named : redirectUrl whose value is req.originalUrl; originalUrl is automatically saved by req */

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next();
}


/* Owner Middelware */
module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner._id.equals(res.locals.currentUser._id)) {
        req.flash("error", "Permission Denied");
      return  res.redirect(`/listings/${id}`)
    }
    next();
};

//VALIDATE LISTING
module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body)
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, errMsg)
    } else {
        next();
    }
};

//VALIDATE REVIEW
module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body)
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, errMsg)
    } else {
        next();
    }
};

/* Author Middelware */
module.exports.isReviewAuthor = async (req, res, next) => {
    let { id,  reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author._id.equals(res.locals.currentUser._id)) {
        req.flash("error", "You are not the author of this review");
      return  res.redirect(`/listings/${id}`)
    }
    next();
};