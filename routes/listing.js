const express = require("express");

const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync.js");

/* LOGIN AUTHENTICATION MIDDLEWARE */
const { isLoggedIn } = require("../middleware.js")

/* IS OWNER MIDDLEWARE */
const { isOwner } = require("../middleware.js")

/* Validate Listing Middleware */
const { validateListing } = require("../middleware.js")

/* CONTROLLER FILE */
const listingController = require("../controllers/listings.js");

/* MULTER FOR PARSING MULTIPART/FORM-DATA FROM URL */
const multer = require("multer");

/* CLOUDINARY CONFIGURATION */
const { storage } = require("../cloudConfig.js");

/* INITIALIZING MULTER FOR USE */
const upload = multer({ storage });



/* PRIVACY ROUTE */
router.get("/privacy",

    wrapAsync(listingController.privacy));

module.exports = router;

/* TERMS ROUTE */
router.get("/terms",

    wrapAsync(listingController.terms));

/* CONSTRUCTION ROUTE */
router.get("/construction",

    wrapAsync(listingController.construction));



//Index Route
router.get("/", wrapAsync(listingController.index));

//New Route
router.get("/new",
    isLoggedIn,
    listingController.new);

//show route
router.get("/:id",
    wrapAsync(listingController.show));

//createNew Listing Route
router.post("/",
    isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.create));


//Edit Route
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.edit));

//Update Route
router.put("/:id",
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.update));

//Delete Route
router.delete("/:id",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.delete));



module.exports = router;