const express = require("express");

const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync.js");

/* Validate review Middleware JOI*/
const { validateReview } = require("../middleware.js");

/* LOGIN AUTHENTICATION MIDDLEWARE */
const { isLoggedIn } = require("../middleware.js")

/* Review author MIDDLEWARE */
const { isReviewAuthor } = require("../middleware.js")

/* CONTROLLER FILE */
const reviewController = require("../controllers/review.js");

//Reviews Route
router.post("/",
    validateReview,
    isLoggedIn,
    wrapAsync(reviewController.review));

//Delete Review Route
router.delete("/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.deleteReview))


module.exports = router;