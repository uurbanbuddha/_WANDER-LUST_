/* USER MODEL */
const User = require("../models/user.js");

/* SIGN UP LINK */
module.exports.signupLink = (req, res) => {
    res.render("users/signup.ejs")
};

/* SIGN UP FORM */
module.exports.signupForm = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({
            email,
            username
        });

        const registeredUser = await User.register(newUser, password);


        /* Automatic Login After SignUp */
        req.login(registeredUser, ((err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Door unlocked to your dream stay");
            res.redirect("/listings")

        }));
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};

/* LOGIN LINK */
module.exports.loginLink = (req, res) => {
    res.render("users/login.ejs")
};

/* LOGIN FORM */
module.exports.loginForm = async (req, res) => {
    req.flash("success", "Welcome back! Pick up where you left off ");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl)
};

/* LOGOUT LINK */
module.exports.logoutLink = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings")

    })
};