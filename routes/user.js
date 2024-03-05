const express = require("express");

const router = express.Router({ mergeParams: true });

const ExpressError = require("../utils/ExpressError.js");

const wrapAsync = require("../utils/wrapAsync.js");

const passport = require("passport");

const { saveRedirectUrl } = require("../middleware.js");

/* CONTROLLER FILE */
const usercontroller = require("../controllers/user.js")

/* SIGNUP ROUTES */
/* LINK */
router.get("/signup",
    usercontroller.signupLink);

/* SIGNUP FORM */
router.post("/signup",
    wrapAsync(usercontroller.signupForm));

/* LOGIN ROUTES */
/* LINK */
router.get("/login",
    usercontroller.loginLink);

/* LOGIN FORM */
router.post("/login",
    saveRedirectUrl,
    passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }),
    wrapAsync(usercontroller.loginForm));

/* LOGOUT ROUTE LINK*/
router.get("/logout",
    usercontroller.logoutLink)

module.exports = router;