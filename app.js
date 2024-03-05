/* FOR .ENV FILE */
if(process.env.NODE_ENV != "production") {
    require('dotenv').config();
};



const express = require("express");

const app = express();

/* const port = 8080; */

const path = require("path");

const methodOverride = require("method-override");

/* Generate HTML markup with plain JavaScript */
const ejsMate = require("ejs-mate");

/* CUSTOM ERROR */
const ExpressError = require("./utils/ExpressError.js");

/* EXPRESS ROUTER FOR LISTING*/
const listings = require("./routes/listing.js");

/* EXPRESS ROUTER FOR REVIEW*/
const reviews = require("./routes/review.js");

/* EXPRESS ROUTER FOR USER */
const user = require("./routes/user.js");

/* SESSION MIDDLEWARE */
const session = require("express-session");

/* CONNECT MONGO */
const MongoStore = require('connect-mongo');

/* TO FLASH A MESSAGE */
const flash = require("connect-flash");

/* PASSPORT FOR AUTHENTICATION */
const passport = require("passport");

/* STRATEGY FOR AUTHENTICATION*/
const LocalStrategy = require("passport-local");

/* USER MODEL FOR AUTHENTICATION */
const User = require("./models/user.js");





app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));

app.use(methodOverride('_method'));

app.engine('ejs', ejsMate);

app.use(express.static(path.join(__dirname, "/public")));


const mongoose = require("mongoose");
const { error } = require('console');
 const MONGO_URL = process.env.MONGODB_URL;

 main()
    .then(() => { console.log("Connected to MongoDB") })
    .catch((err) => console.log(err)) 

async function main() {
    await mongoose.connect(MONGO_URL)
}; 


/* STORE */
const store = MongoStore.create({
    mongoUrl: MONGO_URL,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", () =>{
    console.log("Error in mongo session store", error);
});

/* USING SESSION */
const sessionOption = {
    store: store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 *24 *3,
        maxAge: 1000 * 60 * 60 * 24 * 3,
        htppOnly: true
    }
};

//ROOT ROUTE
/* app.get("/", (req, res) => {

    res.send("Root is working up to the mark!");

});
 */


app.use(session(sessionOption));
app.use(flash());

/* A MIDDLEWARE THAT INITIALIZE PASSPORT */
app.use(passport.initialize());

/*  A WEB APPLICATION NEEDS THE ABILITY TO IDENTIFY USERS AS THEY BROWSE FROM PAGE TO PAGE. THE SERIES OF REQUESTS AND RESPONSES, EACH ASSOCIATED WITH SAME USER, IS KNOWN AS A SESSION */
app.use(passport.session());

/* passport.use(new LocalStrategy());  This line tells Passport to employ the "LocalStrategy" for authentication */
/* User.authenticate()  is a method provided by the passport-local-mongoose  package. It handles the complicated internal logic of securely checking if a provided username and password match a user record in your database. */
passport.use(new LocalStrategy(User.authenticate()));

/*           This function is provided by the passport-local-mongoose plugin.This is a core function in Passport that determines how to store a user's identifying information in their session data.This is necessary so that Passport can remember the user across different page requests within their session. */
passport.serializeUser(User.serializeUser());

/* This line tells Passport to use a specific function (defined by passport-local-mongoose) to unpackage the user information stored in the session and fetch the full user object from the database. This allows Passport to have access to all the user's information for subsequent requests within the authenticated session. */
passport.deserializeUser(User.deserializeUser());











/* PORT DEPLOYMENT */
app.listen(8080, () => {
    console.log("8080 is Working Fine")
});



/* app.get("/testlisting", async (req, res) => {
    let sampleListing = new Listing({
        title: "My New Villa",
        description: "By the Beach",
        price: 5400,
        location: "Calanhute, Goa",
        country: "India"
    })
   await sampleListing.save()
        .then((res) => { console.log(res) })
        .catch((err) => { console.log(err) });
        res.send("successful testing");
}); */

/* FLASH SUCCESS/ERROR MIDDLEWARE */
app.use((req, res , next) => {
    app.locals.success = req.flash("success");
    app.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});

/* DEMO USER */
/* app.get("/demo", async (req, res) => {
    let fakeUser = new User({
        email: "gjfgdsfghj@gmail.com",
        username: "jhgfdsj"
    });

let  registeredUser = await User.register(fakeUser, "qwertyuioplkjhgfdsa");
res.send(registeredUser);

}); */



/* EXPRESS ROUTER USED FOR LISTINGS(PARENT)*/
app.use("/listings", listings)

/* EXPRESS ROUTER USED FOR REVIEWS(PARENT)*/
app.use("/listings/:id/reviews", reviews)

/* EXPRESS ROUTER USED FOR USER(PARENT)*/ 
app.use("/", user)



app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not found!"))
})

/* CUSTOM ERROR HANDLING MIDDLEWARE */
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "something went wrong" } = err
    res.status(statusCode).render("error.ejs", { err })
    /* res.status(statusCode).send(message); */
});






















