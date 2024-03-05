const mongoose = require("mongoose"); //package
const Listing = require("../models/listing.js");  //model
const initData = require("./data.js"); //sample data

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
    await mongoose.connect(MONGO_URL)
};

main()
    .then(() => { console.log("Connected to MongoDB") })
    .catch((err) => console.log(err));

const initDB = async () =>{
   await Listing.deleteMany({});
   initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "65e02d2109e22959b15d18b5"
   }));
    await Listing.insertMany(initData.data);
    console.log("data was initialized")
}

initDB();